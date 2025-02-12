<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getAvatarColor } from '@/lib/utils'
import { format, parseISO } from 'date-fns'

const auth = useAuthStore()
const { toast } = useToast()

onMounted(async () => {
  try {
    await auth.fetchUserProfile()
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
  avatar_url: auth.user?.avatar_url || ''
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
  formData.value = { ...newForm }
}, { immediate: true })

const initialForm = computed(() => JSON.stringify(form.value))

const hasChanges = computed(() => {
  return JSON.stringify(formData.value) !== initialForm.value
})

const getInitials = (name?: string, surname?: string) => {
  return `${name?.[0] || ''}${surname?.[0] || ''}`
}

const getAvatarColorClass = computed(() => {
  if (!form.value.name) return ''
  return getAvatarColor(form.value.name)
})

async function handleSubmit() {
  try {
    await auth.updateProfile(formData.value)
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
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <Avatar class="h-24 w-24">
          <AvatarImage :src="form.avatar_url" />
          <AvatarFallback :class="getAvatarColorClass" size="lg">
            {{ getInitials(form.name, form.surname) }}
          </AvatarFallback>
        </Avatar>
        <Button type="button" variant="outline">
          Zmień avatar
        </Button>
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
</template> 