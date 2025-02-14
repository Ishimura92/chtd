import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserAvatar from '../UserAvatar.vue'

describe('UserAvatar', () => {
  // Test 1: Sprawdzamy czy komponent się renderuje
  it('renderuje się poprawnie', () => {
    const wrapper = mount(UserAvatar)
    expect(wrapper.exists()).toBe(true)
  })

  // Test 2: Sprawdzamy czy inicjały są poprawnie generowane
  it('generuje poprawne inicjały z imienia i nazwiska', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        name: 'Jan',
        surname: 'Kowalski'
      }
    })
    expect(wrapper.text()).toBe('JK')
  })

  // Test 3: Sprawdzamy czy avatar jest wyświetlany
  it('wyświetla avatar gdy URL jest podany', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        name: 'Jan',
        surname: 'Kowalski',
        avatar_url: 'https://example.com/avatar.jpg'
      }
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
  })

  // Test 4: Sprawdzamy czy fallback (inicjały) jest wyświetlany gdy brak avatara
  it('wyświetla fallback z inicjałami gdy brak avatara', () => {
    const wrapper = mount(UserAvatar, {
      props: {
        name: 'Jan',
        surname: 'Kowalski',
        avatar_url: undefined
      }
    })
    const fallback = wrapper.find('[data-testid="avatar-fallback"]')
    expect(fallback.exists()).toBe(true)
    expect(fallback.text()).toBe('JK')
  })
}) 