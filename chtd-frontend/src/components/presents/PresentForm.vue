<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input, InputSuffix } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { usePresentsStore } from '@/stores/presents'
import { useToast } from '@/components/ui/toast/use-toast'
import axios from 'axios'

const props = defineProps<{
  editMode?: boolean
  initialData?: any
}>()

const emit = defineEmits(['close'])
const presentsStore = usePresentsStore()
const { toast } = useToast()

const formData = ref({
  name: props.initialData?.name || '',
  url: props.initialData?.url || '',
  image_url: props.initialData?.image_url || '',
  price: props.initialData?.price || '',
  description: props.initialData?.description || ''
})

const isLoading = ref(false)
const imagePreview = ref<string | null>(null)

// Obsługa przesyłania obrazka
function handleImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      formData.value.image_url = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

async function handleSubmit() {
  try {
    if (props.editMode) {
      await presentsStore.updatePresent(props.initialData.id, formData.value)
      toast({
        title: 'Sukces',
        description: 'Prezent został zaktualizowany'
      })
    } else {
      await presentsStore.addPresent(formData.value)
      toast({
        title: 'Sukces',
        description: 'Prezent został dodany do listy'
      })
    }
    emit('close')
  } catch (error) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się zapisać prezentu',
      variant: 'destructive'
    })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="grid grid-cols-3 gap-6 w-full max-w-4xl min-w-full">
    <!-- Lewa kolumna - dane (2/3 szerokości) -->
    <div class="col-span-2 space-y-4">
      <div class="space-y-2">
        <Label for="url">Link do prezentu</Label>
        <Input 
          id="url" 
          v-model="formData.url" 
          placeholder="https://..."
          :disabled="isLoading"
        />
      </div>

      <div class="space-y-2">
        <Label for="name">Nazwa prezentu</Label>
        <Input 
          id="name" 
          v-model="formData.name" 
          placeholder="Nazwa prezentu"
          :disabled="isLoading"
        />
      </div>

      <div class="space-y-2">
        <Label for="price">Cena orientacyjna</Label>
        <div class="relative">
          <Input 
            id="price" 
            v-model="formData.price" 
            type="number" 
            step="0.01"
            placeholder="0.00"
            :disabled="isLoading"
            class="pr-8"
          />
          <span class="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            zł
          </span>
        </div>
      </div>

      <div class="space-y-2">
        <Label for="description">Opis</Label>
        <Textarea 
          id="description" 
          v-model="formData.description" 
          placeholder="Opis prezentu..."
          :disabled="isLoading"
          class="min-h-[120px]"
        />
      </div>
    </div>

    <!-- Prawa kolumna - zdjęcie (1/3 szerokości) -->
    <div class="space-y-4">
      <div class="space-y-2">
        <Label>Zdjęcie prezentu</Label>
        <div class="border-2 border-dashed rounded-lg p-4 text-center h-full">
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
          <Input 
            type="file" 
            accept="image/*" 
            @change="handleImageUpload"
            class="mt-2"
          />
          <p class="text-sm text-muted-foreground mt-2">
            Zdjęcie zostanie automatycznie pobrane z linku lub możesz dodać własne
          </p>
        </div>
      </div>
    </div>

    <!-- Przyciski na dole (pełna szerokość) -->
    <div class="col-span-3 flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        @click="emit('close')"
      >
        Anuluj
      </Button>
      <Button 
        type="submit"
        :disabled="isLoading"
      >
        {{ editMode ? 'Zapisz zmiany' : 'Dodaj prezent' }}
      </Button>
    </div>
  </form>
</template> 