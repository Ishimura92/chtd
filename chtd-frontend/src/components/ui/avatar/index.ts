import { type VariantProps, cva } from 'class-variance-authority'

export { default as Avatar } from './Avatar.vue'
export { default as AvatarImage } from './AvatarImage.vue'
export { default as AvatarFallback } from './AvatarFallback.vue'

export const avatarVariants = cva(
  'inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-muted overflow-hidden border-2 dark:border-gray-600 border-gray-300',
  {
    variants: {
      size: {
        sm: 'h-10 w-10 text-xs',
        base: 'h-16 w-16 text-2xl',
        lg: 'h-32 w-32 text-5xl'
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-md'
      }
    },
    defaultVariants: {
      size: 'base',
      shape: 'circle'
    }
  }
)

export type AvatarVariants = VariantProps<typeof avatarVariants> 