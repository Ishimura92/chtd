<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="text-center space-y-8">
      <div class="space-y-4">
        <h1 class="text-9xl font-bold text-primary">404</h1>
        <h2 class="text-2xl font-semibold text-foreground">Strona nie znaleziona</h2>
        <p class="text-muted-foreground max-w-md mx-auto">
          Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
        </p>
      </div>
      
      <div class="flex gap-4 justify-center">
        <Button variant="outline" @click="goBack">
          Wróć
        </Button>
        <Button @click="goHome">
          Strona główna
        </Button>
      </div>
    </div>
  </div>
</template> 