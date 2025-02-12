<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <Button 
    variant="ghost" 
    size="icon"
    @click="themeStore.toggleTheme"
    class="rounded-full"
  >
    <Sun v-if="themeStore.theme === 'dark'" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
    <span class="sr-only">Przełącz motyw</span>
  </Button>
</template> 