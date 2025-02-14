import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import axios from '@/lib/axios'
import type { User } from '../auth'

vi.mock('@/lib/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

// Mock dla vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  const createTestUser = (): User => ({
    id: 1,
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    birth_date: undefined,
    name_day_date: undefined,
    avatar_url: undefined
  })

  // Test 1: Stan początkowy
  it('ma poprawny stan początkowy', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  // Test 2: Inicjalizacja z localStorage
  it('inicjalizuje się z danych z localStorage', () => {
    const testUser = createTestUser()
    const testToken = 'test-token'
    
    localStorage.setItem('user', JSON.stringify(testUser))
    localStorage.setItem('token', testToken)
    
    const store = useAuthStore()
    store.initialize()
    
    expect(store.user).toEqual(testUser)
    expect(store.token).toBe(testToken)
    expect(store.isAuthenticated).toBe(true)
  })

  // Test 3: Logowanie
  it('obsługuje logowanie', async () => {
    const store = useAuthStore()
    const testUser = createTestUser()
    const testToken = 'test-token'
    
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { user: testUser, token: testToken }
    })
    
    await store.login('test@example.com', 'password')
    
    expect(store.user).toEqual(testUser)
    expect(store.token).toBe(testToken)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(testUser))
    expect(localStorage.getItem('token')).toBe(testToken)
  })

  // Test 4: Wylogowanie
  it('obsługuje wylogowanie', async () => {
    const store = useAuthStore()
    store.token = 'test-token'
    store.user = createTestUser()
    
    vi.mocked(axios.post).mockResolvedValueOnce({})
    
    await store.logout()
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  // Test 5: Rejestracja
  it('obsługuje rejestrację', async () => {
    const store = useAuthStore()
    const testUser = createTestUser()
    const testToken = 'test-token'
    
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { user: testUser, token: testToken }
    })
    
    await store.register({
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      password: 'password',
      password_confirmation: 'password'
    })
    
    expect(store.user).toEqual(testUser)
    expect(store.token).toBe(testToken)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(testUser))
    expect(localStorage.getItem('token')).toBe(testToken)
  })

  // Test 6: Aktualizacja profilu
  it('obsługuje aktualizację profilu', async () => {
    const store = useAuthStore()
    const updatedUser: User = {
      id: 1,
      name: 'Updated',
      surname: 'User',
      email: 'test@example.com',
      birth_date: '2000-01-01',
      name_day_date: '2000-01-01',
      avatar_url: undefined
    }
    
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { user: updatedUser }
    })
    
    await store.updateProfile({
      name: 'Updated',
      surname: 'User',
      email: 'test@example.com',
      birth_date: '2000-01-01',
      name_day_date: '2000-01-01'
    })
    
    expect(store.user).toEqual(updatedUser)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(updatedUser))
  })

  // Test 7: Pobieranie profilu
  it('obsługuje pobieranie profilu', async () => {
    const store = useAuthStore()
    const testUser = createTestUser()
    
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: { user: testUser }
    })
    
    await store.fetchUserProfile()
    
    expect(store.user).toEqual(testUser)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(testUser))
  })

  // Test 8: Obsługa błędów
  it('obsługuje błędy autoryzacji', async () => {
    const store = useAuthStore()
    
    vi.mocked(axios.post).mockRejectedValueOnce({
      response: {
        status: 401
      }
    })
    
    await store.login('test@example.com', 'wrong-password').catch(() => {})
    
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
}) 