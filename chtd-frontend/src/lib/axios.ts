import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast/use-toast'
import router from '@/router'

// Tworzymy instancję axiosa
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10 sekund timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor dla requestów
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    const token = auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    })

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor dla odpowiedzi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const auth = useAuthStore()
    const { toast } = useToast()
    const originalRequest = error.config

    // Obsługa błędu 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Próba odświeżenia tokenu
        const response = await axios.post('/api/refresh-token')
        const newToken = response.data.token

        // Aktualizacja tokenu w store
        auth.updateToken(newToken)
        
        // Powtórzenie oryginalnego żądania z nowym tokenem
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Jeśli nie udało się odświeżyć tokenu, wyloguj użytkownika
        auth.clearAuth()
        router.push('/login')
        
        toast({
          title: "Sesja wygasła",
          description: "Twoja sesja wygasła. Zaloguj się ponownie.",
          variant: "destructive",
        })
        
        return Promise.reject(refreshError)
      }
    }

    // Obsługa innych błędów HTTP
    if (error.response) {
      switch (error.response.status) {
        case 403:
          toast({
            title: "Brak dostępu",
            description: "Nie masz uprawnień do wykonania tej operacji.",
            variant: "destructive",
          })
          break
          
        case 404:
          toast({
            title: "Nie znaleziono",
            description: "Żądany zasób nie istnieje.",
            variant: "destructive",
          })
          break
          
        case 422:
          // Błędy walidacji są obsługiwane przez komponenty
          break
          
        case 429:
          toast({
            title: "Zbyt wiele prób",
            description: "Spróbuj ponownie za kilka minut.",
            variant: "destructive",
          })
          break
          
        case 500:
          toast({
            title: "Błąd serwera",
            description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.",
            variant: "destructive",
          })
          break
          
        default:
          if (!error.response.status.toString().startsWith('422')) {
            toast({
              title: "Błąd",
              description: "Wystąpił nieoczekiwany błąd.",
              variant: "destructive",
            })
          }
      }
    } else if (error.request) {
      // Błąd sieci
      toast({
        title: "Błąd połączenia",
        description: "Sprawdź swoje połączenie z internetem.",
        variant: "destructive",
      })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance 