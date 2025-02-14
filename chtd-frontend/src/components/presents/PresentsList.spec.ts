import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PresentsList from './PresentsList.vue'
import { createTestingPinia } from '@pinia/testing'
import PresentCard from './PresentCard.vue'

describe('PresentsList', () => {
  const defaultProps = {
    presents: [],
    isOwner: false,
    userName: 'Jan',
    userSurname: 'Kowalski',
    userAvatar: null,
    isLoading: false
  }

  const createWrapper = (props = {}) => {
    return mount(PresentsList, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })],
        stubs: {
          PresentCard: true
        }
      }
    })
  }

  // Test 1: Podstawowe renderowanie
  it('renderuje nagłówek z odpowiednim tekstem', () => {
    // Dla właściciela
    const ownerWrapper = createWrapper({ isOwner: true })
    expect(ownerWrapper.text()).toContain('Chcę dostać')

    // Dla innego użytkownika
    const otherUserWrapper = createWrapper({ 
      isOwner: false, 
      userName: 'Jan',
      userSurname: 'Kowalski'
    })
    expect(otherUserWrapper.text()).toContain('Jan chce dostać')
  })

  // Test 2: Stan ładowania
  it('nie wyświetla nagłówka podczas ładowania', () => {
    const wrapper = createWrapper({ isLoading: true })
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  // Test 3: Stan pustej listy
  it('wyświetla odpowiedni komunikat gdy lista jest pusta', () => {
    // Dla właściciela
    const ownerWrapper = createWrapper({ 
      isOwner: true,
      presents: []
    })
    expect(ownerWrapper.text()).toContain('Brak prezentów na liście')
    expect(ownerWrapper.text()).toContain('Dodaj swój pierwszy prezent')

    // Dla innego użytkownika
    const otherUserWrapper = createWrapper({
      isOwner: false,
      presents: [],
      userName: 'Jan'
    })
    expect(otherUserWrapper.text()).toContain('Jan nie ma jeszcze żadnych prezentów')
  })

  // Test 4: Renderowanie listy prezentów
  it('renderuje listę prezentów', () => {
    const presents = [
      {
        id: 1,
        name: 'Present 1',
        url: 'https://example.com/1',
        image_url: null,
        price: 99.99,
        description: null,
        user_id: 1,
        created_at: '2024-02-14',
        updated_at: '2024-02-14'
      },
      {
        id: 2,
        name: 'Present 2',
        url: 'https://example.com/2',
        image_url: null,
        price: 199.99,
        description: null,
        user_id: 1,
        created_at: '2024-02-14',
        updated_at: '2024-02-14'
      }
    ]

    const wrapper = mount(PresentsList, {
      props: {
        ...defaultProps,
        presents
      },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn
        })],
        stubs: {
          Modal: true,
          PresentForm: true,
          PresentCard: {
            name: 'PresentCard',
            template: '<div>{{ name }}</div>',
            props: ['name']
          }
        }
      }
    })

    const presentElements = wrapper.findAll('[data-test="present-card"]')
    expect(presentElements).toHaveLength(2)
  })

  // Test 5: Przycisk dodawania
  it('pokazuje przycisk dodawania tylko dla właściciela', () => {
    // Dla właściciela
    const ownerWrapper = createWrapper({ isOwner: true })
    expect(ownerWrapper.text()).toContain('Dodaj')

    // Dla innego użytkownika
    const otherUserWrapper = createWrapper({ isOwner: false })
    expect(otherUserWrapper.text()).not.toContain('Dodaj')
  })

  // Test 6: Modal dodawania/edycji
  it('zarządza stanem modali', async () => {
    const wrapper = createWrapper({ isOwner: true })
    
    // Otwieranie modalu dodawania
    await wrapper.find('button').trigger('click')
    expect(wrapper.findComponent({ name: 'Modal' }).props('show')).toBe(true)
  })
}) 