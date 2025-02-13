<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="relative flex items-center">
    <slot />
  </div>
</template> 