import { defineStore } from 'pinia'
import customAxios from '@/lib/axios'
import axios, { isAxiosError } from 'axios'
import type { AxiosError } from 'axios'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from '@/stores/auth'
import type { Present, PresentFormData } from '@/types/presents'

export const usePresentsStore = defineStore('presents', {
  state: () => ({
    presents: [] as Present[],
    isLoading: false,
    error: null as string | null
  }),
  actions: {
    async fetchPresents(userId?: number) {
      this.isLoading = true
      try {
        const response = await customAxios.get(`/presents${userId ? `?user_id=${userId}` : ''}`)
        this.presents = response.data.presents
      } catch (error) {
        console.error('Error fetching presents:', error)
        this.error = 'Nie udało się pobrać prezentów'
      } finally {
        this.isLoading = false
      }
    },
    async addPresent(present: PresentFormData) {
      const authStore = useAuthStore()
      const { toast } = useToast()
      try {
        if (!authStore.user?.id) {
          throw new Error('Brak ID użytkownika')
        }

        const presentData = {
          ...present,
          url: present.url.startsWith('http') ? present.url : `https://${present.url}`,
          user_id: authStore.user.id,
          price: present.price !== undefined ? present.price : null,
          image_url: present.image_url || null
        }
        
        console.log('Sending present data:', presentData)
        const response = await customAxios.post('/presents', presentData, {
          headers: this.getAuthHeaders()
        })
        await this.fetchPresents()
        toast({
          title: 'Sukces',
          description: 'Prezent został dodany do listy'
        })
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Brak ID użytkownika') {
          toast({
            title: 'Błąd',
            description: 'Nie można dodać prezentu - brak ID użytkownika',
            variant: 'destructive'
          })
          authStore.clearAuth()
          return
        }
        if (isAxiosError(error)) {
          console.error('Error adding present:', error.response?.data)
          toast({
            title: 'Błąd',
            description: error.response?.data?.message || 'Nie udało się dodać prezentu',
            variant: 'destructive'
          })
        } else {
          toast({
            title: 'Błąd',
            description: 'Nie udało się dodać prezentu',
            variant: 'destructive'
          })
        }
        throw error
      }
    },
    async updatePresent(id: number, data: PresentFormData) {
      const authStore = useAuthStore()
      const { toast } = useToast()
      try {
        if (!authStore.user?.id) {
          throw new Error('Brak ID użytkownika')
        }

        const presentData = {
          ...data,
          url: data.url.startsWith('http') ? data.url : `https://${data.url}`,
          user_id: authStore.user.id,
          price: data.price !== undefined ? data.price : null,
          image_url: data.image_url || null
        }

        console.log('Updating present with data:', presentData)
        const response = await customAxios.put(`/presents/${id}`, presentData, {
          headers: this.getAuthHeaders()
        })
        await this.fetchPresents()
        toast({
          title: 'Sukces',
          description: 'Prezent został zaktualizowany'
        })
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Brak ID użytkownika') {
          toast({
            title: 'Błąd',
            description: 'Nie można zaktualizować prezentu - brak ID użytkownika',
            variant: 'destructive'
          })
          authStore.clearAuth()
          return
        }
        if (isAxiosError(error)) {
          console.error('Error updating present:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
          })
          toast({
            title: 'Błąd',
            description: error.response?.data?.message || 'Nie udało się zaktualizować prezentu',
            variant: 'destructive'
          })
        } else {
          console.error('Non-axios error:', error)
          toast({
            title: 'Błąd',
            description: 'Nie udało się zaktualizować prezentu',
            variant: 'destructive'
          })
        }
        throw error
      }
    },
    async deletePresent(id: number) {
      const { toast } = useToast()
      try {
        await customAxios.delete(`/presents/${id}`, {
          headers: this.getAuthHeaders()
        })
        this.presents = this.presents.filter(p => p.id !== id)
        toast({
          title: 'Sukces',
          description: 'Prezent został usunięty'
        })
      } catch (error: unknown) {
        console.error('Error deleting present:', error)
        toast({
          title: 'Błąd',
          description: 'Nie udało się usunąć prezentu',
          variant: 'destructive'
        })
      }
    },
    async fetchMetadata(url: string) {
      const { toast } = useToast()
      try {
        const response = await customAxios.post('/presents/fetch-metadata', { url })
        return response.data
      } catch (error: unknown) {
        console.error('Error fetching metadata:', error)
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać informacji o prezencie',
          variant: 'destructive'
        })
        throw error
      }
    },
    getAuthHeaders() {
      const authStore = useAuthStore()
      if (!authStore.token || !authStore.user) {
        throw new Error('Użytkownik nie jest zalogowany')
      }
      return {
        'Authorization': `Bearer ${authStore.token}`
      }
    }
  }
}) 