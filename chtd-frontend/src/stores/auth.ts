import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/lib/axios'
import type { AxiosError } from 'axios'
import { isAxiosError } from 'axios'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from 'vue-router'

export interface User {
  id: number
  name: string
  surname: string
  email: string
  birth_date?: string
  name_day_date?: string
  avatar_url?: string
}

interface ProfileData {
  name: string
  surname: string
  email: string
  birth_date: string
  name_day_date: string
  avatar_url?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Gettery
  const isAuthenticated = computed(() => !!token.value)

  // Akcje
  const initialize = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('login', { email, password })
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      toast({
        title: "Zalogowano pomyślnie",
        description: "Witaj z powrotem!",
        variant: "default",
      })

      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: {
    name: string
    surname: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    try {
      const response = await axios.post('register', userData)
      
      token.value = response.data.token
      user.value = response.data.user
      
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      toast({
        title: "Sukces!",
        description: "Rejestracja przebiegła pomyślnie.",
        variant: "default",
      })

      router.push('/dashboard')
    } catch (error) {
      handleAuthError(error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await axios.post('logout')
      }
      
      toast({
        title: "Wylogowano pomyślnie",
        description: "Do zobaczenia!",
        variant: "default",
      })
    } catch (error) {
      handleAuthError(error)
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const handleAuthError = (error: unknown) => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 422) {
        toast({
          title: "Błąd walidacji",
          description: "Sprawdź wprowadzone dane.",
          variant: "destructive",
        })
      } else if (axiosError.response?.status === 401) {
        toast({
          title: "Sesja wygasła",
          description: "Twoja sesja wygasła. Zaloguj się ponownie.",
          variant: "destructive",
        })
        clearAuth()
      } else {
        toast({
          title: "Błąd",
          description: "Wystąpił nieoczekiwany błąd.",
          variant: "destructive",
        })
      }
    }
  }

  const updateToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  async function updateProfile(data: ProfileData) {
    try {
      const response = await axios.post('/profile', data)
      console.log('Profile update response:', response.data)
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      console.log('Updated user in store:', user.value)
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się zaktualizować profilu')
    }
  }

  async function fetchUserProfile() {
    try {
      const response = await axios.get('/profile')
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się pobrać danych profilu')
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    clearAuth,
    updateToken,
    updateProfile,
    fetchUserProfile
  }
}) 