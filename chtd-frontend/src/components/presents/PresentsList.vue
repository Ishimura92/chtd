<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { usePresentsStore } from '@/stores/presents'
import PresentCard from './PresentCard.vue'
import PresentForm from './PresentForm.vue'
import { Plus, Gift } from 'lucide-vue-next'
import Modal from '@/components/ui/modal/Modal.vue'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'
import type { Present } from '@/types/presents'

const presentsStore = usePresentsStore()
const showAddModal = ref(false)
const editingPresent = ref<Present | null>(null)

const props = defineProps<{
  presents: Present[]
  isOwner: boolean
  userName?: string
  userSurname?: string
  userAvatar?: string | null
  isLoading?: boolean
}>()

onMounted(() => {
  presentsStore.fetchPresents()
})

function handleDelete(id: number) {
  if (confirm('Czy na pewno chcesz usunąć ten prezent?')) {
    presentsStore.deletePresent(id)
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto space-y-4">
    <div v-if="!isLoading" class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        {{ isOwner ? 'Chcę dostać' : `${userName} chce dostać` }}
      </h2>
      <Button v-if="isOwner" @click="showAddModal = true">
        <Plus class="h-4 w-4 mr-2" />
        Dodaj
      </Button>
    </div>

    <!-- Empty state -->
    <div 
      v-if="!presentsStore.presents.length" 
      class="text-center py-12 border-2 border-dashed rounded-lg"
    >
      <Gift class="h-12 w-12 mx-auto text-muted-foreground" />
      <template v-if="isOwner">
        <h3 class="mt-4 text-lg font-medium">Brak prezentów na liście</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Dodaj swój pierwszy prezent, klikając przycisk "Dodaj" powyżej.
        </p>
        <Button 
          variant="outline" 
          class="mt-4"
          @click="showAddModal = true"
        >
          <Plus class="h-4 w-4 mr-2" />
          Dodaj prezent
        </Button>
      </template>
      <template v-else>
        <h3 class="mt-4 text-lg font-medium">
          {{ userName }} nie ma jeszcze żadnych prezentów na swojej liście
        </h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Sprawdź listę później lub zaproponuj dodanie prezentów.
        </p>
      </template>
    </div>

    <!-- Lista prezentów -->
    <div v-else class="space-y-4">
      <PresentCard
        v-for="present in presentsStore.presents"
        :key="present.id"
        v-bind="present"
        :show-actions="isOwner"
        @edit="editingPresent = present"
        @delete="handleDelete(present.id)"
      >
        <img 
          :src="present.image_url || '/images/gift-placeholder.png'" 
          :alt="present.name"
          class="w-full h-48 object-cover rounded-t-lg"
        />
        <UserAvatar
          v-if="present.user"
          :name="present.user.name"
          :surname="present.user.surname"
          :avatar_url="present.user.avatar_url || undefined"
          className="h-10 w-10"
        />
      </PresentCard>
    </div>

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
  </div>
</template> 