<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useFriendsStore } from '@/stores/friends'
import { useToast } from '@/components/ui/toast/use-toast'
import UserAvatar from '@/components/ui/user-avatar/UserAvatar.vue'

const props = defineProps<{
  id: number
  name: string
  surname: string
  avatar?: string
  email: string
}>()

const friends = useFriendsStore()
const { toast } = useToast()

async function handleAccept() {
  try {
    await friends.acceptRequest(props.id)
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

async function handleReject() {
  try {
    await friends.rejectRequest(props.id)
    toast({
      title: 'Sukces',
      description: 'Zaproszenie zostało odrzucone'
    })
  } catch (e) {
    toast({
      title: 'Błąd',
      description: 'Nie udało się odrzucić zaproszenia',
      variant: 'destructive'
    })
  }
}
</script>

<template>
  <div class="flex items-center gap-3 p-2 rounded-lg">
    <UserAvatar
      :name="name"
      :surname="surname"
      :avatar_url="avatar"
      className="h-10 w-10"
    />
    <div class="flex-1">
      <div class="font-medium">{{ name }} {{ surname }}</div>
      <div class="text-sm text-muted-foreground">{{ email }}</div>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" @click="handleAccept">
        Akceptuj
      </Button>
      <Button variant="ghost" size="sm" @click="handleReject">
        Odrzuć
      </Button>
    </div>
  </div>
</template> 