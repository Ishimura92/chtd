import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/lib/axios' 

interface FriendRequest {
  id: number
  name: string
  avatar?: string
  email: string
}

interface SearchResult {
  id: number
  name: string
  surname: string
  avatar?: string
  friendshipStatus: {
    status: 'pending' | 'accepted' | 'rejected'
    isReceived: boolean
  } | null
}

interface Friend {
  id: number
  name: string
  surname: string
  avatar?: string
}

export const useFriendsStore = defineStore('friends', () => {
  const friendRequests = ref<FriendRequest[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchResults = ref<SearchResult[]>([])
  const friends = ref<Friend[]>([])

  async function fetchFriendRequests() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/friendships/pending')
      friendRequests.value = response.data.data
    } catch (e) {
      error.value = 'Nie udało się pobrać listy zaproszeń'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  async function acceptRequest(id: number) {
    try {
      await axios.post(`/friendships/${id}/accept`)
      friendRequests.value = friendRequests.value.filter(req => req.id !== id)
      await fetchFriends()
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się zaakceptować zaproszenia')
    }
  }

  async function rejectRequest(id: number) {
    try {
      await axios.post(`/friendships/${id}/reject`)
      friendRequests.value = friendRequests.value.filter(req => req.id !== id)
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się odrzucić zaproszenia')
    }
  }

  async function searchUsers(query: string) {
    try {
      const response = await axios.get(`/users/search?q=${encodeURIComponent(query)}`)
      searchResults.value = response.data.data
      return response.data.data
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się wyszukać użytkowników')
    }
  }

  async function sendInvite(userId: number) {
    try {
      await axios.post('/friendships', { user_id: userId })
      searchResults.value = searchResults.value.map(user => 
        user.id === userId ? {
          ...user,
          friendshipStatus: {
            status: 'pending',
            isReceived: false
          }
        } : user
      )
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się wysłać zaproszenia')
    }
  }

  async function fetchFriends() {
    try {
      const response = await axios.get('/friendships')
      friends.value = response.data.data
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się pobrać listy znajomych')
    }
  }

  async function removeFriend(friendId: number) {
    try {
      await axios.delete(`/friendships/${friendId}`)
      friends.value = friends.value.filter(friend => friend.id !== friendId)
    } catch (e) {
      console.error(e)
      throw new Error('Nie udało się usunąć znajomego')
    }
  }

  return {
    friendRequests,
    isLoading,
    error,
    fetchFriendRequests,
    acceptRequest,
    rejectRequest,
    searchUsers,
    sendInvite,
    friends,
    fetchFriends,
    removeFriend
  }
}) 