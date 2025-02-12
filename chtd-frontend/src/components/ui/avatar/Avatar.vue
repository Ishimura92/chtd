<script setup lang="ts">
import { avatarVariants, type AvatarVariants } from '.'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: string
    size?: AvatarVariants['size']
    shape?: AvatarVariants['shape']
  }>(),
  {
    size: 'base',
    shape: 'circle'
  }
)

const className = computed(() => 
  cn(avatarVariants({ size: props.size, shape: props.shape }), props.class)
)
</script>

<template>
  <div :class="className" style="position: relative;">
    <slot />
  </div>
</template> 