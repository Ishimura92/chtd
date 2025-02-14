<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { ref } from 'vue'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'
import type { Present } from '@/types/presents'

defineProps<{
  id: number
  name: string
  url: string
  image_url: string | null
  price: string | number | null
  description: string | null
  showActions?: boolean
  user?: {
    name: string
    surname: string
    avatar_url?: string | null
  }
}>()

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="flex gap-4 p-4 border rounded-lg">
    <div v-if="image_url" class="flex-shrink-0">
      <img :src="image_url" alt="" class="w-24 h-24 object-cover rounded" />
    </div>
    
    <div class="flex-grow space-y-2">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold">{{ name }}</h3>
        <UserAvatar
          v-if="user"
          :name="user.name"
          :surname="user.surname"
          :avatar_url="user.avatar_url || undefined"
          className="h-6 w-6"
        />
      </div>
      <p v-if="price !== null" class="text-sm text-muted-foreground">
        {{ typeof price === 'number' ? price.toFixed(2) : Number(price).toFixed(2) }} zł
      </p>
      <p v-if="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>
      <a 
        :href="url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-sm text-primary hover:underline"
      >
        Link
      </a>
    </div>

    <div v-if="showActions" class="flex flex-col gap-2">
      <Button variant="ghost" size="icon" @click="emit('edit')">
        <Pencil class="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" @click="emit('delete')">
        <Trash2 class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template> 