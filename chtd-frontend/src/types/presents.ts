export interface Present {
  id: number
  name: string
  url: string
  image_url: string | null
  price: number | null
  description: string | null
  user_id: number
  created_at: string
  updated_at: string
  user?: {
    name: string
    surname: string
    avatar_url: string | null
  }
}

export interface PresentFormData {
  name: string
  url: string
  image_url: string | null
  price: string | number | undefined
  description: string | undefined
} 