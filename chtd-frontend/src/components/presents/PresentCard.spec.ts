import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PresentCard from './PresentCard.vue'

describe('PresentCard', () => {
  // Podstawowe dane do testów
  const defaultProps = {
    id: 1,
    name: 'Test Present',
    url: 'https://example.com',
    image_url: null,
    price: 99.99,
    description: null,
    showActions: false
  }

  // Test 1: Podstawowe renderowanie
  it('renderuje podstawowe informacje o prezencie', () => {
    const wrapper = mount(PresentCard, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Test Present')
    expect(wrapper.text()).toContain('99.99 zł')
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
  })

  // Test 2: Formatowanie ceny
  it('poprawnie formatuje różne typy cen', async () => {
    // Test dla number
    const wrapperNumber = mount(PresentCard, {
      props: { ...defaultProps, price: 99.9 }
    })
    expect(wrapperNumber.text()).toContain('99.90 zł')

    // Test dla string
    const wrapperString = mount(PresentCard, {
      props: { ...defaultProps, price: '199.9' }
    })
    expect(wrapperString.text()).toContain('199.90 zł')

    // Test dla null
    const wrapperNull = mount(PresentCard, {
      props: { ...defaultProps, price: null }
    })
    expect(wrapperNull.text()).not.toContain('zł')
  })

  // Test 3: Warunkowe renderowanie
  it('warunkowo renderuje elementy', () => {
    // Test bez zdjęcia
    const wrapperNoImage = mount(PresentCard, {
      props: defaultProps
    })
    expect(wrapperNoImage.find('img').exists()).toBe(false)

    // Test ze zdjęciem
    const wrapperWithImage = mount(PresentCard, {
      props: { ...defaultProps, image_url: 'https://example.com/image.jpg' }
    })
    expect(wrapperWithImage.find('img').exists()).toBe(true)

    // Test bez opisu
    const wrapperNoDesc = mount(PresentCard, {
      props: defaultProps
    })
    expect(wrapperNoDesc.text()).not.toContain('description')

    // Test z opisem
    const wrapperWithDesc = mount(PresentCard, {
      props: { ...defaultProps, description: 'Test description' }
    })
    expect(wrapperWithDesc.text()).toContain('Test description')
  })

  // Test 4: Przyciski akcji
  it('pokazuje/ukrywa przyciski akcji', async () => {
    // Bez przycisków
    const wrapperNoActions = mount(PresentCard, {
      props: defaultProps
    })
    expect(wrapperNoActions.findAll('button')).toHaveLength(0)

    // Z przyciskami
    const wrapperWithActions = mount(PresentCard, {
      props: { ...defaultProps, showActions: true }
    })
    expect(wrapperWithActions.findAll('button')).toHaveLength(2)
  })

  // Test 5: Emisja zdarzeń
  it('emituje zdarzenia edit i delete', async () => {
    const wrapper = mount(PresentCard, {
      props: { ...defaultProps, showActions: true }
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click') // Edit button
    expect(wrapper.emitted('edit')).toBeTruthy()
    
    await buttons[1].trigger('click') // Delete button
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  // Test 6: Integracja z UserAvatar
  it('poprawnie renderuje avatar użytkownika', () => {
    const wrapper = mount(PresentCard, {
      props: {
        ...defaultProps,
        user: {
          name: 'Jan',
          surname: 'Kowalski',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      }
    })

    const avatar = wrapper.findComponent({ name: 'UserAvatar' })
    expect(avatar.exists()).toBe(true)
    expect(avatar.props('name')).toBe('Jan')
    expect(avatar.props('surname')).toBe('Kowalski')
    expect(avatar.props('avatar_url')).toBe('https://example.com/avatar.jpg')
  })
}) 