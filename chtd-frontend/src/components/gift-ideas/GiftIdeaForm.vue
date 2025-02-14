<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem } from '@/components/ui/select'
import { useGiftIdeasStore, type GiftIdea } from '@/stores/giftIdeas'
import type { User } from '@/stores/auth'
import customAxios from '@/lib/axios'
import { useToast } from '@/components/ui/toast/use-toast'

interface Props {
  editMode?: boolean
  initialData?: GiftIdea
  friends: User[]
}

const props = withDefaults(defineProps<Props>(), {
  editMode: false,
  initialData: undefined
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: any): void
}>()

const giftIdeasStore = useGiftIdeasStore()
const isLoading = ref(false)
const imagePreview = ref<string | null>(null)
const showSuggestions = ref(true)
const { toast } = useToast()

const formData = ref<{
  name: string
  url: string
  image_url: string | null
  price: string
  description: string
  recipient_input: string
  recipient_type: 'USER' | 'CUSTOM'
  recipient_user_id: string | null
  recipient_custom: string | null
}>({
  name: props.initialData?.name || '',
  url: props.initialData?.url || '',
  image_url: props.initialData?.image_url || null,
  price: props.initialData?.price?.toString() || '',
  description: props.initialData?.description || '',
  recipient_input: '',
  recipient_type: props.initialData?.recipient_type || 'CUSTOM',
  recipient_user_id: props.initialData?.recipient_user_id?.toString() || null,
  recipient_custom: props.initialData?.recipient_custom || null
})

if (props.initialData) {
  if (props.initialData.recipient_type === 'USER' && props.initialData.recipient_user_id) {
    const recipientId = props.initialData.recipient_user_id
    const user = props.friends.find(f => f.id === Number(recipientId))
    if (user) {
      formData.value.recipient_input = `${user.name} ${user.surname}`
    }
  } else if (props.initialData.recipient_type === 'CUSTOM' && props.initialData.recipient_custom) {
    formData.value.recipient_input = props.initialData.recipient_custom
  }
}

const suggestions = computed(() => {
  const input = formData.value.recipient_input?.toLowerCase() || ''
  if (!input) return []
  return props.friends.filter(friend => 
    `${friend.name} ${friend.surname}`.toLowerCase().includes(input)
  )
})

function handleSuggestionSelect(friend: User) {
  formData.value.recipient_input = `${friend.name} ${friend.surname}`
  formData.value.recipient_type = 'USER'
  formData.value.recipient_user_id = friend.id.toString()
  formData.value.recipient_custom = null
  showSuggestions.value = false
}

function handleInputChange(value: string | number) {
  const stringValue = value.toString()
  formData.value.recipient_input = stringValue
  showSuggestions.value = true
  
  const matchingFriend = props.friends.find(friend => 
    `${friend.name} ${friend.surname}` === stringValue
  )
  if (matchingFriend) {
    formData.value.recipient_type = 'USER'
    formData.value.recipient_user_id = matchingFriend.id.toString()
    formData.value.recipient_custom = null
  } else {
    formData.value.recipient_type = 'CUSTOM'
    formData.value.recipient_user_id = null
    formData.value.recipient_custom = stringValue
  }
}

const hasChanges = computed(() => {
  if (!props.initialData) return true
  return Object.keys(formData.value).some(key => {
    const formValue = formData.value[key as keyof typeof formData.value]
    const initialValue = props.initialData?.[key as keyof GiftIdea]
    return formValue?.toString() !== initialValue?.toString()
  })
})

async function handleSubmit() {
  try {
    isLoading.value = true
    const data = {
      name: formData.value.name,
      url: formData.value.url,
      image_url: formData.value.image_url || null,
      price: formData.value.price ? parseFloat(formData.value.price) : null,
      description: formData.value.description || null,
      recipient_type: formData.value.recipient_type,
      recipient_user_id: formData.value.recipient_type === 'USER' ? Number(formData.value.recipient_user_id) : null,
      recipient_custom: formData.value.recipient_type === 'CUSTOM' ? formData.value.recipient_input : null
    }

    if (props.editMode && props.initialData) {
      await giftIdeasStore.updateGiftIdea(props.initialData.id, data)
    } else {
      await giftIdeasStore.addGiftIdea(data)
    }
    emit('close')
  } catch (error) {
    console.error('Error saving gift idea:', error)
  } finally {
    isLoading.value = false
  }
}

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  try {
    const uploadFormData = new FormData()
    uploadFormData.append('image', file)
    
    const response = await customAxios.post('/upload-image', uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const cleanUrl = response.data.url.replace('/api', '')
    formData.value.image_url = `${baseUrl}${cleanUrl}`
    imagePreview.value = URL.createObjectURL(file)
  } catch (error) {
    console.error('Error uploading image:', error)
    toast({
      title: 'Błąd',
      description: 'Nie udało się przesłać zdjęcia',
      variant: 'destructive'
    })
  }
}

function clearImage() {
  formData.value.image_url = null
  imagePreview.value = null
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  if (input) input.value = ''
}

function handleBlur() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

function handleFocus() {
  showSuggestions.value = true
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Dla kogo -->
    <div class="space-y-2">
      <Label for="recipient">Dla kogo</Label>
      <div class="relative">
        <Input
          id="recipient"
          v-model="formData.recipient_input"
          placeholder="Wpisz imię lub wybierz z listy znajomych..."
          @focus="showSuggestions = true"
          @blur="handleBlur"
        />
        <div
          v-if="showSuggestions && suggestions.length > 0"
          class="absolute z-50 w-full mt-1 py-1 bg-popover text-popover-foreground shadow-md rounded-md border"
        >
          <button
            v-for="friend in suggestions"
            :key="friend.id"
            type="button"
            class="w-full px-2 py-1.5 text-left hover:bg-accent"
            @mousedown.prevent="handleSuggestionSelect(friend)"
          >
            {{ friend.name }} {{ friend.surname }}
          </button>
        </div>
      </div>
    </div>

    <!-- Nazwa prezentu -->
    <div class="space-y-2">
      <Label for="name">Nazwa prezentu</Label>
      <Input 
        id="name" 
        v-model="formData.name" 
        placeholder="Nazwa prezentu"
        required
      />
    </div>

    <!-- Cena orientacyjna -->
    <div class="space-y-2">
      <Label for="price">Cena orientacyjna</Label>
      <div class="relative">
        <Input 
          id="price" 
          v-model="formData.price"
          type="number" 
          step="0.01"
          min="0"
          placeholder="0.00"
          class="pr-8"
        />
        <span class="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          zł
        </span>
      </div>
    </div>

    <!-- Opis -->
    <div class="space-y-2">
      <Label for="description">Opis</Label>
      <Textarea 
        id="description" 
        v-model="formData.description" 
        placeholder="Opis prezentu..."
        class="min-h-[120px]"
      />
    </div>

    <!-- Zdjęcie -->
    <div class="space-y-2">
      <Label>Zdjęcie prezentu</Label>
      <div class="border-2 border-dashed rounded-lg p-4 text-center">
        <div v-if="imagePreview" class="mb-4">
          <img 
            :src="imagePreview" 
            alt="Podgląd" 
            class="max-h-48 mx-auto object-contain" 
          />
        </div>
        <div v-else class="py-8">
          <p class="text-muted-foreground">Brak zdjęcia</p>
        </div>
        <div class="flex gap-2 mt-2">
          <Input 
            type="file" 
            accept="image/*" 
            @change="handleImageUpload"
          >
            <span>{{ imagePreview ? 'Zmień' : 'Wybierz plik' }}</span>
          </Input>
          <Button
            v-if="imagePreview"
            type="button"
            variant="outline"
            size="icon"
            @click="clearImage"
          >
            <i class="i-lucide-trash-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Link do prezentu -->
    <div class="space-y-2">
      <Label for="url">Link do prezentu</Label>
      <Input 
        id="url" 
        v-model="formData.url" 
        placeholder="https://..."
        type="url"
        pattern="https?://.+"
        required
      />
    </div>

    <!-- Przyciski -->
    <div class="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        @click="$emit('close')"
      >
        Anuluj
      </Button>
      <Button 
        type="submit"
        :disabled="isLoading"
      >
        {{ editMode ? 'Zapisz zmiany' : 'Dodaj pomysł' }}
      </Button>
    </div>
  </form>
</template> 