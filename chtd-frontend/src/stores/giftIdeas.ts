import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/lib/axios'
import { useToast } from '@/components/ui/toast/use-toast'

export interface GiftIdea {
  id: number
  user_id: number
  name: string
  url: string
  image_url: string | null
  price: number | null
  description: string | null
  recipient_type: 'CUSTOM' | 'USER'
  recipient_user_id: number | null
  recipient_custom: string | null
  created_at: string
  updated_at: string
}

export const useGiftIdeasStore = defineStore('giftIdeas', () => {
  const giftIdeas = ref<GiftIdea[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const { toast } = useToast()

  async function fetchGiftIdeas(userId?: number) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get('/gift-ideas', {
        params: { user_id: userId }
      })
      giftIdeas.value = response.data
    } catch (e) {
      error.value = 'Nie udało się pobrać pomysłów na prezenty'
      toast({
        title: 'Błąd',
        description: error.value,
        variant: 'destructive'
      })
    } finally {
      isLoading.value = false
    }
  }

  async function addGiftIdea(data: Partial<GiftIdea>) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post('/gift-ideas', data)
      giftIdeas.value.push(response.data)
      toast({
        title: 'Sukces',
        description: 'Pomysł na prezent został dodany'
      })
      return response.data
    } catch (e) {
      error.value = 'Nie udało się dodać pomysłu na prezent'
      toast({
        title: 'Błąd',
        description: error.value,
        variant: 'destructive'
      })
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateGiftIdea(id: number, data: Partial<GiftIdea>) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.put(`/gift-ideas/${id}`, data)
      const index = giftIdeas.value.findIndex(idea => idea.id === id)
      if (index !== -1) {
        giftIdeas.value[index] = response.data
      }
      toast({
        title: 'Sukces',
        description: 'Pomysł na prezent został zaktualizowany'
      })
      return response.data
    } catch (e) {
      error.value = 'Nie udało się zaktualizować pomysłu na prezent'
      toast({
        title: 'Błąd',
        description: error.value,
        variant: 'destructive'
      })
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteGiftIdea(id: number) {
    isLoading.value = true
    error.value = null
    try {
      await axios.delete(`/gift-ideas/${id}`)
      giftIdeas.value = giftIdeas.value.filter(idea => idea.id !== id)
      toast({
        title: 'Sukces',
        description: 'Pomysł na prezent został usunięty'
      })
    } catch (e) {
      error.value = 'Nie udało się usunąć pomysłu na prezent'
      toast({
        title: 'Błąd',
        description: error.value,
        variant: 'destructive'
      })
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    giftIdeas,
    isLoading,
    error,
    fetchGiftIdeas,
    addGiftIdea,
    updateGiftIdea,
    deleteGiftIdea
  }
}) 