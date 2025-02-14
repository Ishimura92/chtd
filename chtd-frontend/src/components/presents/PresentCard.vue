<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MoreVertical, Gift } from 'lucide-vue-next'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
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
    <!-- Zdjęcie -->
    <div class="w-24 h-24 shrink-0">
      <img 
        v-if="image_url"
        :src="image_url"
        :alt="name"
        class="w-24 h-24 object-cover rounded"
      />
      <div 
        v-else 
        class="w-full h-full bg-muted rounded flex items-center justify-center"
      >
        <Gift class="h-8 w-8 text-muted-foreground" />
      </div>
    </div>
    
    <div class="flex-grow space-y-2">
      <div class="flex items-center justify-between gap-2">
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

        <div v-if="showActions" class="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem @click="$emit('edit')">
                Edytuj
              </DropdownMenuItem>
              <DropdownMenuItem @click="$emit('delete')">
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
  </div>
</template> 