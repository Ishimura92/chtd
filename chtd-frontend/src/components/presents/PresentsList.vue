<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { usePresentsStore } from '@/stores/presents'
import PresentCard from './PresentCard.vue'
import PresentForm from './PresentForm.vue'
import { Plus, Gift } from 'lucide-vue-next'

const presentsStore = usePresentsStore()
const showAddDialog = ref(false)
const editingPresent = ref<any>(null)

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
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Chcę dostać</h2>
      <Button @click="showAddDialog = true">
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
      <h3 class="mt-4 text-lg font-medium">Brak prezentów na liście</h3>
      <p class="mt-2 text-sm text-muted-foreground">
        Dodaj swój pierwszy prezent, klikając przycisk "Dodaj" powyżej.
      </p>
      <Button 
        variant="outline" 
        class="mt-4"
        @click="showAddDialog = true"
      >
        <Plus class="h-4 w-4 mr-2" />
        Dodaj prezent
      </Button>
    </div>

    <!-- Lista prezentów -->
    <div v-else class="space-y-4">
      <PresentCard
        v-for="present in presentsStore.presents"
        :key="present.id"
        v-bind="present"
        @edit="editingPresent = present"
        @delete="handleDelete(present.id)"
      >
        <img 
          :src="present.image_url || '/images/gift-placeholder.png'" 
          :alt="present.name"
          class="w-full h-48 object-cover rounded-t-lg"
        />
      </PresentCard>
    </div>

    <!-- Dialog dodawania prezentu -->
    <Dialog :open="showAddDialog" @update:open="showAddDialog = false">
      <DialogContent class="w-[70vw] max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Nowy prezent</DialogTitle>
        </DialogHeader>
        <PresentForm @close="showAddDialog = false" />
      </DialogContent>
    </Dialog>

    <!-- Dialog edycji prezentu -->
    <Dialog :open="!!editingPresent" @update:open="(open) => !open && (editingPresent = null)">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj prezent</DialogTitle>
        </DialogHeader>
        <PresentForm 
          v-if="editingPresent"
          edit-mode 
          :initial-data="editingPresent"
          @close="editingPresent = null"
        />
      </DialogContent>
    </Dialog>
  </div>
</template> 