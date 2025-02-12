<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Gift, Users, Settings, MoreVertical, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { getAvatarColor } from '@/lib/utils'
import FriendRequest from '@/components/dashboard/FriendRequest.vue'
import WantsTab from '@/components/dashboard/tabs/WantsTab.vue'
import IdeasTab from '@/components/dashboard/tabs/IdeasTab.vue'
import KidsTab from '@/components/dashboard/tabs/KidsTab.vue'
import SettingsTab from '@/components/dashboard/tabs/SettingsTab.vue'
import { useFriendsStore } from '@/stores/friends'
import { useToast } from '@/components/ui/toast/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const auth = useAuthStore()
const friends = useFriendsStore()
const { toast } = useToast()

// Aktywna zakładka
const activeTab = ref('wants')

const tabs = [
  { id: 'wants', label: 'Chcę dostać', icon: Gift },
  { id: 'ideas', label: 'Pomysły dla bliskich', icon: Gift },
  { id: 'kids', label: 'Moje dzieci', icon: Users },
  { id: 'settings', label: 'Ustawienia', icon: Settings }
]

const getInitials = (name?: string, surname?: string) => {
  return `${name?.[0] || ''}${surname?.[0] || ''}`
}

const getAvatarColorClass = computed(() => {
  if (!auth.user?.name) return ''
  return getAvatarColor(auth.user.name)
})

onMounted(() => {
  friends.fetchFriendRequests()
  friends.fetchFriends()
})

// Po zaakceptowaniu zaproszenia odświeżamy listę znajomych
async function handleAcceptRequest(id: number) {
  try {
    await friends.acceptRequest(id)
    await friends.fetchFriends()
    toast({
      title: 'Sukces',
      description: 'Zaproszenie zostało zaakceptowane'
    })
  } catch (e) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się zaakceptować zaproszenia',
      variant: 'destructive'
    })
  }
}

async function removeFriend(friendId: number) {
  try {
    await friends.removeFriend(friendId)
    toast({
      title: 'Sukces',
      description: 'Znajomy został usunięty'
    })
  } catch (e) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się usunąć znajomego',
      variant: 'destructive'
    })
  }
}
</script>

<template>
  <div class="container mx-auto p-4 flex gap-6">
    <!-- Lewa kolumna - znajomi -->
    <div class="w-72 shrink-0 space-y-6">
      <!-- Sekcja "Ty" -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Ty</h2>
        <div class="flex items-center gap-3">
          <Avatar class="h-10 w-10">
            <AvatarImage :src="auth.user?.avatar" />
            <AvatarFallback :class="getAvatarColorClass" size="sm">
              {{ getInitials(auth.user?.name, auth.user?.surname) }}
            </AvatarFallback>
          </Avatar>
          <span class="font-medium">{{ auth.user?.name }} {{ auth.user?.surname }}</span>
        </div>
      </div>

      <!-- Sekcja Zaproszenia -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold flex items-center gap-2">
          Zaproszenia
          <span v-if="friends.friendRequests.length" class="bg-primary text-primary-foreground rounded-full px-2 text-sm">
            {{ friends.friendRequests.length }}
          </span>
        </h2>
        
        <div v-if="friends.isLoading" class="text-sm text-muted-foreground">
          Ładowanie...
        </div>
        
        <div v-else-if="friends.error" class="text-sm text-red-500">
          {{ friends.error }}
        </div>
        
        <div v-else-if="!friends.friendRequests.length" class="text-sm text-muted-foreground">
          Brak zaproszeń
        </div>
        
        <div v-else class="space-y-3">
          <FriendRequest 
            v-for="request in friends.friendRequests" 
            :key="request.id"
            v-bind="request"
          />
        </div>
      </div>

      <!-- Sekcja Znajomi -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">Twoi znajomi</h2>
        
        <div v-if="friends.isLoading" class="text-sm text-muted-foreground">
          Ładowanie...
        </div>
        
        <div v-else-if="!friends.friends.length" class="text-sm text-muted-foreground">
          Na Twojej liście znajomych świeci pustkami, zmieńmy to!
        </div>
        
        <div v-else class="space-y-3">
          <div v-for="friend in friends.friends" :key="friend.id" class="flex items-center gap-3">
            <Avatar class="h-10 w-10">
              <AvatarImage :src="friend.avatar" />
              <AvatarFallback size="sm">
                {{ friend.name[0] }}{{ friend.surname[0] }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <div class="font-medium">{{ friend.name }} {{ friend.surname }}</div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" class="h-8 w-8">
                  <MoreVertical class="h-4 w-4" />
                  <span class="sr-only">Otwórz menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="removeFriend(friend.id)" class="text-destructive">
                  <Trash2 class="h-4 w-4 mr-2" />
                  Usuń znajomego
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button 
          class="w-full" 
          @click="$router.push('/find-friends')"
        >
          Znajdź znajomych
        </Button>
      </div>
    </div>

    <!-- Prawa kolumna - główna zawartość -->
    <div class="flex-1 space-y-6">
      <!-- Nagłówek z avatarem i danymi użytkownika -->
      <div class="flex items-center gap-4 pb-6 border-b">
        <Avatar class="h-24 w-24">
          <AvatarImage :src="auth.user?.avatar" />
          <AvatarFallback :class="getAvatarColorClass" size="lg">
            {{ getInitials(auth.user?.name, auth.user?.surname) }}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 class="text-2xl font-bold">Twoje konto</h1>
          <p class="text-muted-foreground">
            <span class="inline-flex items-center gap-2">
              <Gift class="h-4 w-4" />
              Urodziny {{ auth.user?.birthday }}
            </span>
          </p>
        </div>
      </div>

      <!-- Zakładki -->
      <div class="border-b">
        <nav class="flex gap-4">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-2 -mb-px flex items-center gap-2"
            :class="{
              'border-b-2 border-primary font-medium': activeTab === tab.id,
              'text-muted-foreground': activeTab !== tab.id
            }"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Zawartość zakładki -->
      <component :is="activeTab === 'wants' ? WantsTab :
                    activeTab === 'ideas' ? IdeasTab :
                    activeTab === 'kids' ? KidsTab :
                    SettingsTab" />
    </div>
  </div>
</template> 