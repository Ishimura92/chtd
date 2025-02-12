<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useFriendsStore } from '@/stores/friends'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
  id: number
  name: string
  avatar?: string
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
  <div class="flex items-center gap-3">
    <Avatar class="h-10 w-10">
      <AvatarImage :src="avatar" />
      <AvatarFallback>{{ name[0] }}</AvatarFallback>
    </Avatar>
    <div class="flex-1">
      <div class="font-medium">{{ name }}</div>
    </div>
    <div class="flex gap-2">
      <Button variant="ghost" size="sm" class="text-red-500" @click="handleReject">
        Odrzuć
      </Button>
      <Button size="sm" class="bg-green-500 hover:bg-green-600 text-white" @click="handleAccept">
        Akceptuj
      </Button>
    </div>
  </div>
</template> 