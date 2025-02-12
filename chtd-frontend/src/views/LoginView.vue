<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeOffIcon from '@/components/icons/EyeOffIcon.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { loginSchema } from '@/lib/validation'

const showPassword = ref(false)
const isLoading = ref(false)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// Domyślne wartości formularza
const initialValues = {
  email: 'jan@example.com',
  password: 'Password123!'
}

const handleLogin = async (values: any, { setErrors }) => {
  isLoading.value = true
  try {
    await auth.login(values.email, values.password)
    
    const redirect = route.query.redirect as string
    if (redirect) {
      router.push(redirect)
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    // Ustawiamy błąd na poziomie formularza
    setErrors({
      form: 'Błędny login lub hasło'
    })
  } finally {
    isLoading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Logowanie</CardTitle>
        <CardDescription>
          Zaloguj się do swojego konta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form 
          :validation-schema="loginSchema"
          :initial-values="initialValues"
          @submit="handleLogin"
          v-slot="{ errors: formErrors }"
          class="space-y-4"
        >
          <!-- Dodajemy błąd formularza na górze -->
          <p v-if="formErrors.form" class="text-sm text-red-500 text-center p-2 bg-red-50 rounded">
            {{ formErrors.form }}
          </p>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Field name="email" v-slot="{ field, errors }">
              <Input 
                v-bind="field"
                type="email"
                :class="{ 'border-red-500': errors.length }"
              />
            </Field>
            <ErrorMessage name="email" class="text-sm text-red-500" />
          </div>

          <div class="space-y-2">
            <Label for="password">Hasło</Label>
            <div class="relative">
              <Field name="password" v-slot="{ field, errors }">
                <Input 
                  v-bind="field"
                  :type="showPassword ? 'text' : 'password'"
                  :class="{ 'border-red-500': errors.length }"
                />
              </Field>
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <EyeIcon v-if="showPassword" class="h-4 w-4" />
                <EyeOffIcon v-else class="h-4 w-4" />
              </button>
            </div>
            <ErrorMessage name="password" class="text-sm text-red-500" />
          </div>

          <Button 
            type="submit" 
            class="w-full" 
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <span class="animate-spin mr-2">⭮</span>
              Logowanie...
            </template>
            <template v-else>
              Zaloguj się
            </template>
          </Button>
        </Form>
      </CardContent>
      <CardFooter class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground text-center">
          Nie masz jeszcze konta?
          <Button variant="link" class="px-1.5" @click="$router.push('/register')">
            Zarejestruj się
          </Button>
        </p>
      </CardFooter>
    </Card>
  </div>
</template> 