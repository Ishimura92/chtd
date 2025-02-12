<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg'
}
</script>

<template>
  <div
    class="flex h-full w-full items-center justify-center rounded-full bg-muted font-medium absolute inset-0"
    :class="cn(sizeClasses[size], props.class)"
  >
    <slot />
  </div>
</template> 