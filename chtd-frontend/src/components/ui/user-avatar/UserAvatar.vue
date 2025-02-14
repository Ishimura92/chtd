<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getAvatarColor } from '@/lib/utils'

interface Props {
  name?: string
  surname?: string
  avatar_url?: string
  size?: 'sm' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  className: ''
})

const getInitials = computed(() => {
  return `${props.name?.[0] || ''}${props.surname?.[0] || ''}`
})

const getAvatarColorClass = computed(() => {
  if (!props.name) return ''
  return getAvatarColor(props.name)
})
</script>

<template>
  <Avatar :class="className">
    <AvatarImage :src="avatar_url" />
    <AvatarFallback 
      v-if="!avatar_url" 
      :class="getAvatarColorClass" 
      :size="size"
      data-testid="avatar-fallback"
    >
      {{ getInitials }}
    </AvatarFallback>
  </Avatar>
</template> 