<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import EyeIcon from '@/components/icons/EyeIcon.vue'
import EyeOffIcon from '@/components/icons/EyeOffIcon.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { registerSchema } from '@/lib/validation'

const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const isLoading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const handleRegister = async (values: any) => {
  isLoading.value = true
  try {
    await auth.register({
      name: values.name,
      surname: values.surname,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    })
  } catch {
    // Błędy są obsługiwane przez interceptor
  } finally {
    isLoading.value = false
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const togglePasswordConfirmation = () => {
  showPasswordConfirmation.value = !showPasswordConfirmation.value
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Rejestracja</CardTitle>
        <CardDescription>
          Stwórz konto aby zacząć korzystać z ChceToDostać
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form 
          :validation-schema="registerSchema"
          @submit="handleRegister"
          class="space-y-4"
        >
          <div class="space-y-2">
            <Label for="name">Imię</Label>
            <Field name="name" v-slot="{ field, errors }">
              <Input 
                v-bind="field"
                type="text"
                placeholder="Jan"
                :class="{ 'border-red-500': errors.length }"
              />
            </Field>
            <ErrorMessage name="name" class="text-sm text-red-500" />
          </div>

          <div class="space-y-2">
            <Label for="surname">Nazwisko</Label>
            <Field name="surname" v-slot="{ field, errors }">
              <Input 
                v-bind="field"
                type="text"
                placeholder="Kowalski"
                :class="{ 'border-red-500': errors.length }"
              />
            </Field>
            <ErrorMessage name="surname" class="text-sm text-red-500" />
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Field name="email" v-slot="{ field, errors }">
              <Input 
                v-bind="field"
                type="email"
                placeholder="jan@example.com"
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

          <div class="space-y-2">
            <Label for="password_confirmation">Potwierdź hasło</Label>
            <div class="relative">
              <Field name="password_confirmation" v-slot="{ field, errors }">
                <Input 
                  v-bind="field"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  :class="{ 'border-red-500': errors.length }"
                />
              </Field>
              <button
                type="button"
                @click="togglePasswordConfirmation"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <EyeIcon v-if="showPasswordConfirmation" class="h-4 w-4" />
                <EyeOffIcon v-else class="h-4 w-4" />
              </button>
            </div>
            <ErrorMessage name="password_confirmation" class="text-sm text-red-500" />
          </div>

          <Button 
            type="submit" 
            class="w-full" 
            :disabled="isLoading"
          >
            <template v-if="isLoading">
              <span class="animate-spin mr-2">⭮</span>
              Rejestracja...
            </template>
            <template v-else>
              Zarejestruj się
            </template>
          </Button>
        </Form>
      </CardContent>
      <CardFooter class="flex flex-col gap-4">
        <p class="text-sm text-muted-foreground text-center">
          Masz już konto?
          <Button variant="link" class="px-1.5" @click="$router.push('/login')">
            Zaloguj się
          </Button>
        </p>
      </CardFooter>
    </Card>
  </div>
</template> 