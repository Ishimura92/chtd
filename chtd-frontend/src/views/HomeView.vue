<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main>
    <div class="min-h-screen bg-background text-foreground">
      <main class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 gap-8">
        <!-- Hero section -->
        <div class="text-center space-y-4">
          <h1 class="text-6xl font-bold tracking-tighter">ChceToDostać</h1>
          <p class="text-xl text-muted-foreground max-w-[600px]">
            Twórz listy prezentów, dziel się nimi z bliskimi i sprawiaj radość bez niespodzianek
          </p>
        </div>

        <!-- Feature cards -->
        <div class="grid md:grid-cols-3 gap-6 w-full max-w-[1200px]">
          <Card>
            <CardHeader>
              <CardTitle>Twórz listy</CardTitle>
              <CardDescription>
                Stwórz swoją listę wymarzonych prezentów
              </CardDescription>
            </CardHeader>
            <CardContent>
              Dodawaj, edytuj i organizuj swoje prezenty w prosty sposób
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Udostępniaj</CardTitle>
              <CardDescription>
                Podziel się listą z rodziną i przyjaciółmi
              </CardDescription>
            </CardHeader>
            <CardContent>
              Zaproś bliskich do swojej listy i pozwól im wybrać prezenty
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rezerwuj</CardTitle>
              <CardDescription>
                Zarezerwuj prezenty dla innych
              </CardDescription>
            </CardHeader>
            <CardContent>
              Wybierz prezent z listy znajomego i oznacz go jako zarezerwowany
            </CardContent>
          </Card>
        </div>

        <!-- CTA buttons -->
        <div class="flex gap-4">
          <Button size="lg" @click="router.push('/login')">
            Zaloguj się
          </Button>
          <Button size="lg" variant="secondary" @click="router.push('/register')">
            Zarejestruj się
          </Button>
        </div>
      </main>
    </div>
  </main>
</template>
