<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'
import { Gift, Users, Settings, MoreVertical, Trash2, Flower } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/stores/auth'
import { getAvatarColor } from '@/lib/utils'
import FriendRequest from '@/components/dashboard/FriendRequest.vue'
import WantsTab from '@/components/dashboard/tabs/WantsTab.vue'
import IdeasTab from '@/components/dashboard/tabs/IdeasTab.vue'
import KidsTab from '@/components/dashboard/tabs/KidsTab.vue'
import SettingsTab from '@/components/dashboard/tabs/SettingsTab.vue'
import { useFriendsStore } from '@/stores/friends'
import { useToast } from '@/components/ui/toast/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

type Friend = User

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const friends = useFriendsStore()
const { toast } = useToast()
const activeUser = ref<Friend | null>(auth.user)

const tabs = [
  {
    title: 'Chcę dostać',
    route: { name: 'wanted-presents' },
    icon: Gift
  },
  {
    title: 'Pomysły dla bliskich',
    route: { name: 'ideas-for-others' },
    icon: Gift
  },
  {
    title: 'Moje dzieci',
    route: { name: 'my-children' },
    icon: Users
  },
  {
    title: 'Ustawienia',
    route: { name: 'settings' },
    icon: Settings
  }
]

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'Nie podano daty'
  return format(new Date(date), 'd MMMM', { locale: pl })
}

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

function setActiveUser(user: Friend | null) {
  activeUser.value = user
  if (user?.id !== auth.user?.id) {
    router.push({ name: 'wanted-presents' })
  }
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex gap-12">
      <!-- Lewa kolumna - znajomi -->
      <div class="w-72 shrink-0 space-y-6">
        <!-- Sekcja "Ty" -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">Ty</h2>
          <div 
            class="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
            :class="{ 'bg-accent': activeUser?.id === auth.user?.id }"
            @click="setActiveUser(auth.user)"
          >
            <UserAvatar
              :name="auth.user?.name"
              :surname="auth.user?.surname"
              :avatar_url="auth.user?.avatar_url"
              className="h-10 w-10"
            />
            <span class="font-medium">{{ auth.user?.name }} {{ auth.user?.surname }}</span>
          </div>
        </div>

        <!-- Sekcja Zaproszenia -->
        <div v-if="friends.friendRequests.length || friends.isLoading" class="space-y-4">
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
            <div 
              v-for="friend in friends.friends" 
              :key="friend.id" 
              class="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
              :class="{ 'bg-accent': activeUser?.id === friend.id }"
              @click="setActiveUser(friend)"
            >
              <UserAvatar
                :name="friend.name"
                :surname="friend.surname"
                :avatar_url="friend.avatar_url"
                className="h-10 w-10"
              />
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
          <UserAvatar
            :name="activeUser?.name"
            :surname="activeUser?.surname"
            :avatar_url="activeUser?.avatar_url"
            size="lg"
            className="h-24 w-24"
          />
          <div>
            <h1 class="text-2xl font-bold">
              {{ activeUser?.id === auth.user?.id ? 'Twoje konto' : `${activeUser?.name} ${activeUser?.surname}` }}
            </h1>
            <p class="text-muted-foreground">
              <span class="inline-flex items-center gap-2 space-x-4">
                <Gift class="h-4 w-4" />
                Urodziny: {{ activeUser?.birth_date ? formatDate(activeUser?.birth_date) : 'Nie podano daty urodzin' }}
                <Flower class="h-4 w-4 ml-4" />
                Imieniny: {{ activeUser?.name_day_date ? formatDate(activeUser?.name_day_date) : 'Nie podano daty imienin' }}
              </span>
            </p>
          </div>
        </div>

        <!-- Zakładki -->
        <div v-if="activeUser?.id === auth.user?.id" class="border-b">
          <nav class="flex gap-4">
            <button
              v-for="tab in tabs"
              :key="tab.title"
              @click="router.push(tab.route)"
              class="px-4 py-2 -mb-px flex items-center gap-2"
              :class="{
                'border-b-2 border-primary font-medium': route.name === tab.route.name,
                'text-muted-foreground': route.name !== tab.route.name
              }"
            >
              <component :is="tab.icon" class="h-4 w-4" />
              {{ tab.title }}
            </button>
          </nav>
        </div>

        <!-- Router view dla zawartości zakładek -->
        <router-view 
          v-if="activeUser" 
          :user-id="activeUser.id" 
          :user-name="activeUser.name"
          @settings-updated="() => {
            if (auth.user && activeUser) {
              activeUser.name = auth.user.name
              activeUser.surname = auth.user.surname
              activeUser.email = auth.user.email
              activeUser.avatar_url = auth.user.avatar_url
              activeUser.birth_date = auth.user.birth_date
              activeUser.name_day_date = auth.user.name_day_date
              activeUser.id = auth.user.id
              setActiveUser(auth.user)
            }
          }"
        />
      </div>
    </div>
  </div>
</template> 