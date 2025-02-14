import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PresentForm from './PresentForm.vue'
import { createTestingPinia } from '@pinia/testing'

// Mock dla customAxios
vi.mock('@/lib/axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { url: 'https://example.com/image.jpg' } })
  }
}))

// Mock dla URL.createObjectURL
vi.stubGlobal('URL', {
  createObjectURL: vi.fn().mockReturnValue('blob:test')
})

describe('PresentForm', () => {
  const defaultProps = {
    editMode: false,
    initialData: undefined
  }

  const createWrapper = (props = {}) => {
    return mount(PresentForm, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })]
      }
    })
  }

  // Test 1: Podstawowe renderowanie
  it('renderuje wszystkie pola formularza', () => {
    const wrapper = createWrapper()
    
    // Sprawdzamy czy wszystkie pola są obecne
    expect(wrapper.find('input[type="url"]').exists()).toBe(true)
    expect(wrapper.find('input#name').exists()).toBe(true)
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
  })

  // Test 2: Inicjalizacja z danymi
  it('poprawnie inicjalizuje formularz z danymi', () => {
    const initialData = {
      name: 'Test Present',
      url: 'https://example.com',
      price: 99.99,
      description: 'Test description',
      image_url: 'https://example.com/image.jpg'
    }

    const wrapper = createWrapper({
      editMode: true,
      initialData
    })

    // Sprawdzamy czy pola mają odpowiednie wartości
    const nameInput = wrapper.find('input#name').element as HTMLInputElement
    const urlInput = wrapper.find('input[type="url"]').element as HTMLInputElement
    const priceInput = wrapper.find('input[type="number"]').element as HTMLInputElement
    const descriptionInput = wrapper.find('textarea').element as HTMLTextAreaElement

    expect(nameInput.value).toBe(initialData.name)
    expect(urlInput.value).toBe(initialData.url)
    expect(priceInput.value).toBe(initialData.price.toString())
    expect(descriptionInput.value).toBe(initialData.description)
  })

  // Test 3: Walidacja formularza
  it('wymaga wypełnienia obowiązkowych pól', async () => {
    const wrapper = createWrapper()
    
    // Próba wysłania pustego formularza
    await wrapper.find('form').trigger('submit')
    
    // Sprawdzamy czy pola required są oznaczone
    expect(wrapper.find('input[type="url"]').attributes('required')).toBeDefined()
    expect(wrapper.find('input#name').attributes('required')).toBeDefined()
  })

  // Test 4: Obsługa przesyłania obrazka
  it('wywołuje handleImageUpload po wybraniu pliku', async () => {
    const wrapper = createWrapper()
    
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    const input = wrapper.find('input[type="file"]')
    
    // Symulujemy przesłanie pliku
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })
    await input.trigger('change')

    // Sprawdzamy czy URL.createObjectURL został wywołany
    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
  })

  // Test 5: Przyciski akcji
  it('wyświetla odpowiednie przyciski w zależności od trybu', () => {
    // Tryb dodawania
    const addWrapper = createWrapper()
    expect(addWrapper.text()).toContain('Dodaj prezent')
    
    // Tryb edycji
    const editWrapper = createWrapper({ editMode: true })
    expect(editWrapper.text()).toContain('Zapisz zmiany')
  })

  // Test 6: Emisja zdarzeń
  it('emituje zdarzenie close po anulowaniu', async () => {
    const wrapper = createWrapper()
    
    // Klikamy przycisk anuluj
    await wrapper.find('button[type="button"]').trigger('click')
    
    // Sprawdzamy czy zdarzenie zostało wyemitowane
    expect(wrapper.emitted('close')).toBeTruthy()
  })
}) 