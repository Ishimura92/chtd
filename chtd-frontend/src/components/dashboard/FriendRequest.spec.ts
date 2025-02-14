import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FriendRequest from './FriendRequest.vue'
import { createTestingPinia } from '@pinia/testing'
import { useFriendsStore } from '@/stores/friends'

describe('FriendRequest', () => {
  const defaultProps = {
    id: 1,
    name: 'Jan',
    surname: 'Kowalski',
    avatar: undefined,
    email: 'jan.kowalski@example.com'
  }

  const createWrapper = (props = {}) => {
    const wrapper = mount(FriendRequest, {
      props: { ...defaultProps, ...props },
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            friends: {
              friendRequests: []
            }
          }
        })]
      }
    })
    return {
      wrapper,
      store: useFriendsStore()
    }
  }

  // Test 1: Podstawowe renderowanie
  it('renderuje podstawowe informacje o użytkowniku', () => {
    const { wrapper } = createWrapper()
    
    expect(wrapper.text()).toContain('Jan Kowalski')
    expect(wrapper.text()).toContain('jan.kowalski@example.com')
  })

  // Test 2: Avatar użytkownika
  it('renderuje komponent UserAvatar z poprawnymi propsami', () => {
    const { wrapper } = createWrapper()
    const avatar = wrapper.findComponent({ name: 'UserAvatar' })
    
    expect(avatar.exists()).toBe(true)
    expect(avatar.props('name')).toBe('Jan')
    expect(avatar.props('surname')).toBe('Kowalski')
    expect(avatar.props('avatar')).toBeUndefined()
  })

  // Test 3: Przyciski akcji
  it('renderuje przyciski akcji', () => {
    const { wrapper } = createWrapper()
    const buttons = wrapper.findAll('button')
    
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toContain('Akceptuj')
    expect(buttons[1].text()).toContain('Odrzuć')
  })

  // Test 4: Obsługa akceptacji zaproszenia
  it('wywołuje odpowiednią akcję po akceptacji zaproszenia', async () => {
    const { wrapper, store } = createWrapper()
    const acceptButton = wrapper.findAll('button')[0]
    
    await acceptButton.trigger('click')
    expect(store.acceptRequest).toHaveBeenCalledWith(1)
  })

  // Test 5: Obsługa odrzucenia zaproszenia
  it('wywołuje odpowiednią akcję po odrzuceniu zaproszenia', async () => {
    const { wrapper, store } = createWrapper()
    const rejectButton = wrapper.findAll('button')[1]
    
    await rejectButton.trigger('click')
    expect(store.rejectRequest).toHaveBeenCalledWith(1)
  })

  // Test 6: Wyświetlanie avatara
  it('przekazuje poprawny URL avatara', () => {
    const avatarUrl = 'https://example.com/avatar.jpg'
    const { wrapper } = createWrapper({
      avatar: avatarUrl
    })
    
    const avatar = wrapper.findComponent({ name: 'UserAvatar' })
    expect(avatar.props('avatar_url')).toBe(avatarUrl)
    expect(avatar.props('className')).toBe('h-10 w-10')
  })
}) 