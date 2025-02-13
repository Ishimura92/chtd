<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Gift } from 'lucide-vue-next'
import { usePresentsStore } from '@/stores/presents'
import { useAuthStore } from '@/stores/auth'
import PresentsList from '@/components/presents/PresentsList.vue'
import PresentForm from '@/components/presents/PresentForm.vue'
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

const presentsStore = usePresentsStore()
const auth = useAuthStore()
const showAddModal = ref(false)
const editingPresent = ref<any>(null)

console.log('WantsTab - userId:', props.userId)

onMounted(async () => {
  await presentsStore.fetchPresents(props.userId)
})

watch(() => props.userId, async (newId) => {
  await presentsStore.fetchPresents(newId)
})

function handleAdd() {
  showAddModal.value = true
}

function handleEdit(present: any) {
  editingPresent.value = present
}

function handleDelete(id: number) {
  if (confirm('Czy na pewno chcesz usunąć ten prezent?')) {
    presentsStore.deletePresent(id)
  }
}

defineEmits<{
  (e: 'settings-updated'): void
}>()
</script>

<template>
  <PresentsList
    :presents="presentsStore.presents"
    :is-owner="userId === auth.user?.id"
    :user-name="userName"
    :user-surname="userSurname"
    :user-avatar="userAvatar"
    :is-loading="presentsStore.isLoading"
    @add="handleAdd"
    @edit="handleEdit"
    @delete="handleDelete"
  />

  <!-- Modal dodawania prezentu -->
  <Modal
    :show="showAddModal"
    title="Nowy prezent"
    @close="showAddModal = false"
  >
    <PresentForm @close="showAddModal = false" />
  </Modal>

  <!-- Modal edycji prezentu -->
  <Modal
    :show="!!editingPresent"
    title="Edytuj prezent"
    @close="editingPresent = null"
  >
    <PresentForm 
      v-if="editingPresent"
      edit-mode 
      :initial-data="editingPresent"
      @close="editingPresent = null"
    />
  </Modal>
</template> 