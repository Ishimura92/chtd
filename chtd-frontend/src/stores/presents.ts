import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/lib/axios'
import { useToast } from '@/components/ui/toast/use-toast'

interface Present {
  id: number
  name: string
  url: string
  image_url?: string
  price?: number
  description?: string
  created_at: string
  updated_at: string
}

interface PresentFormData {
  name: string
  url: string
  image_url?: string
  price?: number
  description?: string
}

export const usePresentsStore = defineStore('presents', () => {
  const presents = ref<Present[]>([])
  const { toast } = useToast()

  async function fetchPresents() {
    try {
      const response = await axios.get('/presents')
      presents.value = response.data.presents
    } catch (e) {
      console.error('Error fetching presents:', e)
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać listy prezentów',
        variant: 'destructive'
      })
    }
  }

  async function addPresent(present: any) {
    try {
      const response = await axios.post('/presents', present, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      await fetchPresents()
      toast({
        title: 'Sukces',
        description: 'Prezent został dodany do listy'
      })
    } catch (error) {
      console.error('Error adding present:', error)
      toast({
        title: 'Błąd',
        description: 'Nie udało się dodać prezentu',
        variant: 'destructive'
      })
      throw error
    }
  }

  async function updatePresent(id: number, data: PresentFormData) {
    try {
      const response = await axios.put(`/presents/${id}`, data)
      await fetchPresents()
      toast({
        title: 'Sukces',
        description: 'Prezent został zaktualizowany'
      })
    } catch (e) {
      console.error('Error updating present:', e)
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować prezentu',
        variant: 'destructive'
      })
      throw e
    }
  }

  async function deletePresent(id: number) {
    try {
      await axios.delete(`/presents/${id}`)
      presents.value = presents.value.filter(p => p.id !== id)
      toast({
        title: 'Sukces',
        description: 'Prezent został usunięty'
      })
    } catch (e) {
      console.error('Error deleting present:', e)
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć prezentu',
        variant: 'destructive'
      })
    }
  }

  async function fetchMetadata(url: string) {
    try {
      const response = await axios.post('/presents/fetch-metadata', { url })
      return response.data
    } catch (e) {
      console.error('Error fetching metadata:', e)
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać informacji o prezencie',
        variant: 'destructive'
      })
      throw e
    }
  }

  return {
    presents,
    fetchPresents,
    addPresent,
    updatePresent,
    deletePresent,
    fetchMetadata
  }
}) 