<script setup lang="ts">
interface Props {
  value: string
}

defineProps<Props>()
</script>

<template>
  <button
    type="button"
    class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
    @click="$emit('select', value)"
  >
    <slot />
  </button>
</template> 