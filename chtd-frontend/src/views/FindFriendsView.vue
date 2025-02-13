<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'
import { Link } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useFriendsStore } from '@/stores/friends'
import { useToast } from '@/components/ui/toast/use-toast'

const auth = useAuthStore()
const friends = useFriendsStore()
const { toast } = useToast()

const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)

// Debounced search
let searchTimeout: NodeJS.Timeout
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)
  if (newQuery.length >= 2) {
    isLoading.value = true
    searchTimeout = setTimeout(async () => {
      try {
        const response = await friends.searchUsers(newQuery)
        searchResults.value = response
      } catch (e) {
        toast({
          title: 'Błąd',
          description: 'Nie udało się wyszukać użytkowników',
          variant: 'destructive'
        })
      } finally {
        isLoading.value = false
      }
    }, 300)
  } else {
    searchResults.value = []
  }
})

async function sendInvite(userId: number) {
  try {
    await friends.sendInvite(userId)
    toast({
      title: 'Sukces',
      description: 'Zaproszenie zostało wysłane'
    })
  } catch (e) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się wysłać zaproszenia',
      variant: 'destructive'
    })
  }
}

async function acceptRequest(userId: number) {
  try {
    await friends.acceptRequest(userId)
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
</script>

<template>
  <div class="container mx-auto p-4 max-w-3xl space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="link" class="text-muted-foreground" @click="$router.back()">
        Powrót
      </Button>
      <h1 class="text-2xl font-bold">Szukaj znajomych</h1>
    </div>

    <div class="space-y-6">
      <Input 
        v-model="searchQuery"
        type="search"
        placeholder="Szukaj..."
        class="w-full"
      />

      <!-- Empty state -->
      <div v-if="!searchQuery && !searchResults.length" class="text-center py-12">
        <div class="inline-flex justify-center mb-4">
          <Link class="h-12 w-12 text-muted-foreground" />
        </div>
        <p class="text-muted-foreground mb-2">
          Wyszukaj znajomego po imieniu i nazwisku. Jeśli nie możesz
          go znaleźć, wyślij mu link do swojego profilu, wystarczy, że
          kliknie "Zaproś do znajomych"! :)
        </p>
      </div>

      <!-- Loading state -->
      <div v-else-if="isLoading" class="text-center py-12">
        <span class="animate-spin inline-block mr-2">⭮</span>
        Szukamy...
      </div>

      <!-- Results -->
      <div v-else-if="searchResults.length" class="space-y-4">
        <div v-for="user in searchResults" :key="user.id" class="flex items-center gap-3">
          <UserAvatar
            :name="user.name"
            :surname="user.surname"
            :avatar-url="user.avatar || user.avatar_url"
            className="h-10 w-10"
          />
          <div class="flex-1">
            <div class="font-medium">{{ user.name }} {{ user.surname }}</div>
            <div v-if="user.friendshipStatus?.isReceived" class="text-sm text-muted-foreground">
              Wysłał Ci zaproszenie do znajomych
            </div>
          </div>
          
          <!-- Przyciski z poprawną kolejnością warunków -->
          <Button 
            v-if="user.friendshipStatus?.status === 'accepted'"
            variant="outline" 
            disabled
          >
            Jesteście znajomymi
          </Button>

          <Button 
            v-else-if="user.friendshipStatus?.status === 'pending' && !user.friendshipStatus.isReceived"
            variant="outline" 
            disabled
          >
            Zaproszenie wysłane
          </Button>

          <Button 
            v-else-if="user.friendshipStatus?.status === 'pending' && user.friendshipStatus.isReceived"
            class="bg-green-500 hover:bg-green-600 text-white"
            @click="acceptRequest(user.id)"
          >
            Akceptuj zaproszenie
          </Button>

          <Button 
            v-else
            @click="sendInvite(user.id)"
          >
            Wyślij zaproszenie
          </Button>
        </div>
      </div>

      <!-- No results -->
      <div v-else-if="searchQuery.length >= 2" class="text-center py-12">
        <p class="text-muted-foreground">
          Nie ma Twojego znajomego?
        </p>
        <Button variant="link" class="mt-2">
          Zaproś go do rodziny ChcęToDostać!
        </Button>
      </div>
    </div>
  </div>
</template> 