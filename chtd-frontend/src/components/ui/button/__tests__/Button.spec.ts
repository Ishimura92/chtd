import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'
import { buttonVariants } from '..'

describe('Button', () => {
  // Test 1: Podstawowe renderowanie
  it('renderuje się z domyślnymi propsami', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('items-center')
  })

  // Test 2: Warianty
  it('renderuje się z różnymi wariantami', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
    
    variants.forEach(variant => {
      const wrapper = mount(Button, {
        props: { variant },
        slots: {
          default: 'Button'
        }
      })
      const classes = buttonVariants({ variant })
      expect(wrapper.classes()).toContain(classes.split(' ')[0])
    })
  })

  // Test 3: Rozmiary
  it('renderuje się w różnych rozmiarach', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const
    
    sizes.forEach(size => {
      const wrapper = mount(Button, {
        props: { size },
        slots: {
          default: 'Button'
        }
      })
      const classes = buttonVariants({ size })
      expect(wrapper.classes()).toContain(classes.split(' ')[0])
    })
  })

  // Test 4: Stan disabled
  it('jest wyłączony gdy disabled jest true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('disabled:opacity-50')
  })

  // Test 5: Obsługa zdarzeń
  it('emituje zdarzenie click gdy nie jest wyłączony', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Clickable Button'
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  // Test 6: Brak emisji zdarzeń gdy wyłączony
  it('nie emituje zdarzeń click gdy jest wyłączony', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  // Test 7: Niestandardowy element
  it('renderuje się jako inny element HTML', () => {
    const wrapper = mount(Button, {
      props: {
        as: 'a',
        href: '#'
      },
      slots: {
        default: 'Link Button'
      }
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('#')
  })
}) 