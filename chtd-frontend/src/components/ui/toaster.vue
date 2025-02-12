<script setup lang="ts">
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'

const { toasts } = useToast()
</script>

<template>
  <ToastProvider>
    <ToastViewport class="fixed top-0 right-0 flex flex-col gap-2 w-[390px] max-w-[100vw] p-4 z-[100]" />
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :variant="toast.variant"
      :class="toast.class"
      :type="toast.type"
      :duration="toast.duration"
      :title="toast.title"
      :description="toast.description"
      @update:open="toast.onOpenChange"
    >
      <div class="grid gap-1">
        <div v-if="toast.title" class="text-sm font-semibold">
          {{ toast.title }}
        </div>
        <div v-if="toast.description" class="text-sm opacity-90">
          {{ toast.description }}
        </div>
      </div>
    </Toast>
  </ToastProvider>
</template> 