<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Wybierz...',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const selectedValue = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  selectedValue.value = newValue
})

function toggleDropdown() {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

function closeDropdown() {
  isOpen.value = false
}

function handleSelect(value: string) {
  selectedValue.value = value
  emit('update:modelValue', value)
  closeDropdown()
}
</script>

<template>
  <div class="relative">
    <Button
      type="button"
      variant="outline"
      class="w-full justify-between"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span class="truncate">
        <slot name="selected">
          {{ selectedValue || placeholder }}
        </slot>
      </span>
      <ChevronDown
        class="h-4 w-4 opacity-50"
        :class="{ 'transform rotate-180': isOpen }"
      />
    </Button>

    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md border"
    >
      <div class="p-1">
        <slot />
      </div>
    </div>
  </div>
</template> 