<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Lightbulb } from 'lucide-vue-next'
import { useGiftIdeasStore } from '@/stores/giftIdeas'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import GiftIdeaList from '@/components/gift-ideas/GiftIdeaList.vue'
import GiftIdeaForm from '@/components/gift-ideas/GiftIdeaForm.vue'
import Modal from '@/components/ui/modal/Modal.vue'

interface Props {
  userId?: number
  userName?: string
  userSurname?: string
  userAvatar?: string
}

const props = withDefaults(defineProps<Props>(), {
  userId: undefined,
  userName: undefined,
  userSurname: undefined,
  userAvatar: undefined
})

const giftIdeasStore = useGiftIdeasStore()
const auth = useAuthStore()
const friends = useFriendsStore()
const showAddModal = ref(false)
const editingIdea = ref<any>(null)

onMounted(async () => {
  await giftIdeasStore.fetchGiftIdeas(props.userId)
  if (auth.user?.id === props.userId) {
    await friends.fetchFriends()
  }
})

watch(() => props.userId, async (newId) => {
  await giftIdeasStore.fetchGiftIdeas(newId)
})

function handleAdd() {
  showAddModal.value = true
}

function handleEdit(idea: any) {
  editingIdea.value = idea
}

function handleDelete(id: number) {
  if (confirm('Czy na pewno chcesz usunąć ten pomysł na prezent?')) {
    giftIdeasStore.deleteGiftIdea(id)
  }
}

defineEmits<{
  (e: 'settings-updated'): void
}>()
</script>

<template>
  <GiftIdeaList
    :gift-ideas="giftIdeasStore.giftIdeas"
    :is-owner="userId === auth.user?.id"
    :user-name="userName"
    :user-surname="userSurname"
    :user-avatar="userAvatar"
    :is-loading="giftIdeasStore.isLoading"
    :friends="friends.friends"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />

  <!-- Modal dodawania pomysłu -->
  <Modal
    :show="showAddModal"
    title="Nowy pomysł na prezent"
    @close="showAddModal = false"
  >
    <GiftIdeaForm 
      :friends="friends.friends"
      @close="showAddModal = false" 
    />
  </Modal>

  <!-- Modal edycji pomysłu -->
  <Modal
    :show="!!editingIdea"
    title="Edytuj pomysł na prezent"
    @close="editingIdea = null"
  >
    <GiftIdeaForm 
      v-if="editingIdea"
      :friends="friends.friends"
      edit-mode 
      :initial-data="editingIdea"
      @close="editingIdea = null"
    />
  </Modal>
</template> 