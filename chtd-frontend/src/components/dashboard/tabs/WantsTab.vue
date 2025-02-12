<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Gift } from 'lucide-vue-next'

const hasItems = false
</script>

<template>
  <div v-if="!hasItems" class="text-center py-12">
    <div class="inline-flex justify-center mb-4">
      <Gift class="h-12 w-12 text-muted-foreground" />
    </div>
    <h2 class="text-xl font-semibold mb-2">
      Tutaj tworzysz listę rzeczy, które chcesz dostać
    </h2>
    <p class="text-muted-foreground mb-6">
      Spróbujemy dodać pierwszą?
    </p>
    <Button>
      Dodaj
    </Button>
  </div>
</template> 