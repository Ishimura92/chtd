import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../Input.vue'

describe('Input', () => {
  // Test 1: Podstawowe renderowanie
  it('renderuje się z domyślnymi propsami', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.classes()).toContain('flex')
  })

  // Test 2: Przekazywanie wartości
  it('aktualizuje wartość przy zmianie', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.setProps({ modelValue: e })
      }
    })
    
    await wrapper.find('input').setValue('test')
    expect(wrapper.props('modelValue')).toBe('test')
  })

  // Test 3: Obsługa disabled
  it('jest wyłączony gdy disabled jest true', () => {
    const wrapper = mount(Input, {
      props: {
        disabled: true
      }
    })
    expect(wrapper.find('input').element.disabled).toBe(true)
  })

  // Test 4: Obsługa placeholder
  it('wyświetla placeholder', () => {
    const placeholder = 'Wpisz tekst...'
    const wrapper = mount(Input, {
      props: {
        placeholder
      }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe(placeholder)
  })

  // Test 5: Obsługa type
  it('ustawia odpowiedni typ inputa', () => {
    const types = ['text', 'password', 'email', 'number', 'url'] as const
    
    types.forEach(type => {
      const wrapper = mount(Input, {
        props: { type }
      })
      expect(wrapper.find('input').attributes('type')).toBe(type)
    })
  })

  // Test 6: Obsługa required
  it('obsługuje atrybut required', () => {
    const wrapper = mount(Input, {
      props: {
        required: true
      }
    })
    expect(wrapper.find('input').element.required).toBe(true)
  })

  // Test 7: Obsługa pattern
  it('obsługuje atrybut pattern', () => {
    const pattern = '[0-9]+'
    const wrapper = mount(Input, {
      props: {
        pattern
      }
    })
    expect(wrapper.find('input').attributes('pattern')).toBe(pattern)
  })

  // Test 8: Obsługa min/max dla typu number
  it('obsługuje atrybuty min i max dla typu number', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'number',
        min: 0,
        max: 100
      }
    })
    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('0')
    expect(input.attributes('max')).toBe('100')
  })
}) 