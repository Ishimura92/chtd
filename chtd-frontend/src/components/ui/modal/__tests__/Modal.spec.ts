import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '../Modal.vue'

describe('Modal', () => {
  const defaultProps = {
    show: false,
    title: 'Test Modal'
  }

  const createWrapper = (props = {}) => {
    return mount(Modal, {
      props: { ...defaultProps, ...props },
      slots: {
        default: '<div>Test Content</div>'
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
  }

  // Test 1: Podstawowe renderowanie
  it('nie renderuje się gdy show jest false', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  // Test 2: Pokazywanie modalu
  it('renderuje się gdy show jest true', () => {
    const wrapper = createWrapper({ show: true })
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test Modal')
    expect(wrapper.text()).toContain('Test Content')
  })

  // Test 3: Zamykanie modalu przez przycisk
  it('emituje zdarzenie close po kliknięciu przycisku zamknięcia', async () => {
    const wrapper = createWrapper({ show: true })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  // Test 4: Zamykanie modalu przez overlay
  it('emituje zdarzenie close po kliknięciu w overlay', async () => {
    const wrapper = createWrapper({ show: true })
    await wrapper.find('.bg-black\\/80').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  // Test 5: Renderowanie tytułu
  it('renderuje tytuł modalu', () => {
    const wrapper = createWrapper({ 
      show: true,
      title: 'Custom Title'
    })
    expect(wrapper.find('h2').text()).toBe('Custom Title')
  })

  // Test 6: Obsługa slotów
  it('renderuje zawartość przekazaną przez slot', () => {
    const wrapper = mount(Modal, {
      props: { 
        show: true,
        title: 'Test Modal'
      },
      slots: {
        default: '<div class="test-content">Custom Content</div>'
      },
      global: {
        stubs: {
          Teleport: true
        }
      }
    })
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Custom Content')
  })

  // Test 7: Zamykanie przez ESC
  describe('obsługa klawisza ESC', () => {
    let addEventListenerSpy: any
    let removeEventListenerSpy: any

    beforeEach(() => {
      addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    })

    afterEach(() => {
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('dodaje i usuwa event listener dla klawisza ESC', () => {
      const wrapper = createWrapper({ show: true })
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
      
      wrapper.unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('emituje zdarzenie close po naciśnięciu ESC', () => {
      const wrapper = createWrapper({ show: true })
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  // Test 8: Zatrzymywanie propagacji kliknięć
  it('zatrzymuje propagację kliknięć w zawartości modalu', async () => {
    const wrapper = createWrapper({ show: true })
    const modalContent = wrapper.find('.relative.w-\\[90vw\\]')
    await modalContent.trigger('click')
    expect(wrapper.emitted('close')).toBeFalsy()
  })
}) 