<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  src?: string
  alt?: string
  class?: string
}>()

const emit = defineEmits<{
  error: [event: Event]
}>()
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    @error="emit('error', $event)"
    class="h-full w-full object-cover absolute inset-0"
    :class="class"
  />
</template> 