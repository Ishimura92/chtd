<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import Toaster from '@/components/ui/toaster.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const auth = useAuthStore()

onMounted(() => {
  auth.initialize()
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b bg-background">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <RouterLink to="/" class="text-3xl font-bold">
            ChceToDostać
          </RouterLink>
          <ThemeToggle />
        </div>
        
        <div v-if="!auth.isAuthenticated" class="flex items-center gap-4">
          <Button variant="outline" @click="$router.push('/login')">
            Zaloguj się
          </Button>
          <Button @click="$router.push('/register')">
            Zarejestruj się
          </Button>
        </div>

        <div v-else class="flex items-center gap-4">
          <div class="text-sm text-muted-foreground">
            {{ auth.user?.name }} {{ auth.user?.surname }} ({{ auth.user?.email }})
          </div>
          <Button variant="outline" @click="auth.logout">
            Wyloguj
          </Button>
        </div>
      </div>
    </header>
    <RouterView />
    <Toaster />
  </div>
</template>

<style scoped>
header {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<!-- Usuwamy style -->
