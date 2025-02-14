<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'
import { format, parseISO } from 'date-fns'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import Modal from '@/components/ui/modal/Modal.vue'
import customAxios from '@/lib/axios'
import { isAxiosError } from 'axios'
import type { AxiosError } from 'axios'

const auth = useAuthStore()
const { toast } = useToast()
const emit = defineEmits<{
  (e: 'settings-updated'): void
}>()

const showAvatarModal = ref(false)
const imageRef = ref<any>(null)
const selectedFile = ref<File | null>(null)
const cropError = ref<string | null>(null)

function getFileUrl(file: File | null) {
  return file ? URL.createObjectURL(file) : ''
}

onMounted(async () => {
  try {
    await auth.fetchUserProfile()
    console.log('Avatar URL:', auth.user?.avatar)
    console.log('Form data:', form.value)
  } catch (e) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się pobrać danych profilu',
      variant: 'destructive'
    })
  }
})

// Dodajmy logowanie, żeby zobaczyć co przychodzi z API
console.log('User data from API:', auth.user)

// Funkcja pomocnicza do formatowania daty z bazy do formatu HTML input date
function formatDateForInput(dateString: string | null | undefined) {
  if (!dateString) return ''
  try {
    console.log(`Formatting date: ${dateString}`)
    const formatted = format(parseISO(dateString), 'yyyy-MM-dd')
    console.log(`Formatted date: ${formatted}`)
    return formatted
  } catch (e) {
    console.error('Error formatting date:', e)
    return ''
  }
}

// Zamiast ref używamy computed dla formularza
const form = computed(() => ({
  name: auth.user?.name || '',
  surname: auth.user?.surname || '',
  email: auth.user?.email || '',
  birth_date: formatDateForInput(auth.user?.birth_date),
  name_day_date: formatDateForInput(auth.user?.name_day_date),
  avatar_url: auth.user?.avatar || ''
}))

// Musimy też zmienić sposób obsługi formularza, bo computed jest readonly
const formData = ref({
  name: '',
  surname: '',
  email: '',
  birth_date: '',
  name_day_date: '',
  avatar_url: ''
})

// Aktualizuj formData gdy zmienia się form
watch(() => form.value, (newForm) => {
  console.log('Form updated:', newForm)
  formData.value = { ...newForm }
}, { immediate: true })

const initialForm = computed(() => JSON.stringify(form.value))

const hasChanges = computed(() => {
  return JSON.stringify(formData.value) !== initialForm.value
})

async function handleSubmit() {
  try {
    await auth.updateProfile(formData.value)
    emit('settings-updated')
    toast({
      title: 'Sukces',
      description: 'Twoje dane zostały zaktualizowane'
    })
  } catch (e) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się zaktualizować danych',
      variant: 'destructive'
    })
  }
}

function cleanupResources() {
  if (selectedFile.value) {
    URL.revokeObjectURL(getFileUrl(selectedFile.value))
  }
  selectedFile.value = null
  imageRef.value = null
  cropError.value = null
  showAvatarModal.value = false
}

function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    selectedFile.value = file
    showAvatarModal.value = true;
    (event.target as HTMLInputElement).value = ''
  }
}

async function saveCroppedAvatar() {
  if (!imageRef.value) {
    cropError.value = 'Brak referencji do croppera'
    return
  }
  
  try {
    cropError.value = null
    const { coordinates, canvas } = imageRef.value.getResult()
    console.log('Cropper result:', { coordinates })
    
    // Konwertuj canvas na blob
    canvas.toBlob(async (blob: Blob) => {
      try {
        console.log('Przygotowanie pliku:', {
          type: blob.type,
          size: blob.size
        })

        const imageFormData = new FormData()
        imageFormData.append('image', blob, 'avatar.png')
        
        console.log('Wysyłanie avatara na serwer...')
        
        const response = await customAxios.post('/profile/avatar', imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          timeout: 30000,
          validateStatus: (status) => {
            return status >= 200 && status < 300
          }
        })
        
        console.log('Odpowiedź z serwera:', response.data)
        
        if (!response.data.url) {
          throw new Error('Brak URL w odpowiedzi z serwera')
        }
        
        formData.value.avatar_url = response.data.url
        console.log('Zaktualizowano formData z nowym avatarem:', formData.value)
        
        await handleSubmit()
        console.log('Profil zaktualizowany, nowy auth.user:', auth.user)
        
        cleanupResources()
        
        toast({
          title: 'Sukces',
          description: 'Avatar został zaktualizowany'
        })
      } catch (error: unknown) {
        console.error('Błąd podczas wysyłania avatara:', {
          error,
          response: isAxiosError(error) ? error.response?.data : undefined,
          status: isAxiosError(error) ? error.response?.status : undefined
        })

        let errorMessage = 'Nie udało się zapisać avatara'
        
        if (isAxiosError(error)) {
          if (error.response?.data?.error) {
            errorMessage = error.response.data.error
          } else if (error.response?.data?.errors) {
            errorMessage = Object.values(error.response.data.errors).flat().join(', ')
          } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'Przekroczono limit czasu połączenia'
          }
        }

        cropError.value = errorMessage
      }
    }, 'image/png', 0.9)
  } catch (error: unknown) {
    console.error('Błąd podczas przygotowywania avatara:', error)
    cropError.value = 'Nie udało się przetworzyć zdjęcia'
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <UserAvatar
          :name="form.name"
          :surname="form.surname"
          :avatar-url="form.avatar_url"
          size="lg"
          className="h-24 w-24"
        />
        <Button type="button" variant="outline" @click="$refs.avatarInput.click()">
          Zmień avatar
        </Button>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarUpload"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="name">Imię</Label>
          <Input id="name" v-model="formData.name" />
        </div>
        
        <div class="space-y-2">
          <Label for="surname">Nazwisko</Label>
          <Input id="surname" v-model="formData.surname" />
        </div>
      </div>

      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" v-model="formData.email" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="birth_date">Data urodzenia</Label>
          <Input 
            id="birth_date" 
            type="date" 
            v-model="formData.birth_date"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="name_day_date">Data imienin</Label>
          <Input 
            id="name_day_date" 
            type="date" 
            v-model="formData.name_day_date"
          />
        </div>
      </div>
    </div>

    <Button type="submit" class="w-full" :disabled="!hasChanges">
      Zapisz zmiany
    </Button>
  </form>

  <!-- Modal z cropperem -->
  <Modal
    :show="Boolean(showAvatarModal)"
    title="Dostosuj zdjęcie profilowe"
    @close="cleanupResources"
  >
    <div class="space-y-4">
      <Cropper
        v-if="selectedFile"
        ref="imageRef"
        :stencil-props="{ aspectRatio: 1 }"
        :stencil-component="CircleStencil"
        :src="getFileUrl(selectedFile)"
        class="h-[400px]"
      />
      <div v-if="cropError" class="p-3 mb-2 text-sm text-destructive bg-destructive/10 rounded-md">
        {{ cropError }}
      </div>
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="cleanupResources">
          Anuluj
        </Button>
        <Button @click="saveCroppedAvatar" :disabled="!!cropError">
          Zapisz
        </Button>
      </div>
    </div>
  </Modal>
</template> 