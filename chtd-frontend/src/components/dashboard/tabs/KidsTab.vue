<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-vue-next'

const hasKids = false
</script>

<template>
  <div v-if="!hasKids" class="text-center py-12">
    <div class="inline-flex justify-center mb-4">
      <Users class="h-12 w-12 text-muted-foreground" />
    </div>
    <h2 class="text-xl font-semibold mb-2">
      Masz dość pytań o prezenty dla Twoich pociech?
    </h2>
    <p class="text-muted-foreground mb-6">
      Zrób oddzielną listę każdemu z nich!
    </p>
    <Button>
      Dostosuj
    </Button>
  </div>
</template> 