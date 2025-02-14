<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Lightbulb, Plus, MoreVertical } from 'lucide-vue-next'
import type { GiftIdea } from '@/stores/giftIdeas'
import type { User } from '@/stores/auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Props {
  giftIdeas: GiftIdea[]
  isOwner: boolean
  userName?: string
  userSurname?: string
  userAvatar?: string
  isLoading: boolean
  friends: User[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', idea: GiftIdea): void
  (e: 'delete', id: number): void
}>()

function getRecipientLabel(idea: GiftIdea): string {
  if (idea.recipient_type === 'USER') {
    const friend = props.friends.find(f => f.id === idea.recipient_user_id)
    return friend ? `Dla ${friend.name} ${friend.surname}` : 'Dla znajomego'
  }
  return idea.recipient_custom || 'Dla bliskiej osoby'
}

function getImageUrl(url: string | null): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const cleanUrl = url.replace('/api', '')
  return `${baseUrl}${cleanUrl}`
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto space-y-4">
    <div v-if="!isLoading" class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        {{ isOwner ? 'Pomysły na prezenty dla bliskich' : `Pomysły ${userName} na prezenty` }}
      </h2>
      <Button v-if="isOwner" @click="emit('add')">
        <Plus class="h-4 w-4 mr-2" />
        Dodaj
      </Button>
    </div>

    <!-- Empty state -->
    <div 
      v-if="!giftIdeas.length" 
      class="text-center py-12 border-2 border-dashed rounded-lg"
    >
      <Lightbulb class="h-12 w-12 mx-auto text-muted-foreground" />
      <template v-if="isOwner">
        <h3 class="mt-4 text-lg font-medium">Brak pomysłów na prezenty</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Dodaj swój pierwszy pomysł na prezent, klikając przycisk "Dodaj" powyżej.
        </p>
        <Button 
          variant="outline" 
          class="mt-4"
          @click="emit('add')"
        >
          <Plus class="h-4 w-4 mr-2" />
          Dodaj pomysł
        </Button>
      </template>
      <template v-else>
        <h3 class="mt-4 text-lg font-medium">
          {{ userName }} nie ma jeszcze żadnych pomysłów na prezenty
        </h3>
        <p class="mt-2 text-sm text-muted-foreground">
          Sprawdź listę później.
        </p>
      </template>
    </div>

    <!-- Lista pomysłów -->
    <div v-else class="grid gap-4">
      <div 
        v-for="idea in giftIdeas" 
        :key="idea.id"
        class="flex items-start gap-4 p-4 border rounded-lg"
      >
        <!-- Zdjęcie -->
        <div class="w-24 h-24 shrink-0">
          <img 
            v-if="idea.image_url"
            :src="getImageUrl(idea.image_url)"
            :alt="idea.name"
            class="w-full h-full object-cover rounded-lg"
          />
          <div 
            v-else 
            class="w-full h-full bg-muted rounded-lg flex items-center justify-center"
          >
            <Lightbulb class="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <!-- Informacje -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-medium truncate">{{ idea.name }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ getRecipientLabel(idea) }}
              </p>
            </div>
            
            <div v-if="isOwner" class="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical class="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem @click="emit('edit', idea)">
                    Edytuj
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="emit('delete', idea.id)">
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div class="mt-2 space-y-1">
            <p v-if="idea.description" class="text-sm text-muted-foreground line-clamp-2">
              {{ idea.description }}
            </p>
            <p v-if="idea.price !== null && idea.price !== undefined" class="text-sm font-medium">
              {{ Number(idea.price).toFixed(2) }} zł
            </p>
          </div>

          <div class="mt-2">
            <a 
              :href="idea.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-sm text-primary hover:underline"
            >
              Link
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 