<template>
  <div class="default-layout">
    <header>
      <!-- Tutaj możemy później dodać nagłówek -->
    </header>
    
    <main>
      <router-view></router-view>
    </main>

    <footer>
      <!-- Tutaj możemy później dodać stopkę -->
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DefaultLayout'
})
</script>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style> 