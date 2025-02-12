export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const validateEmail = (email: string) => {
  if (!email) return 'Email jest wymagany'
  if (!emailRegex.test(email)) return 'Nieprawidłowy format emaila'
  return ''
}

export const validatePassword = (password: string) => {
  if (!password) return 'Hasło jest wymagane'
  if (password.length < 8) return 'Hasło musi mieć minimum 8 znaków'
  return ''
}

export const validateName = (name: string) => {
  if (!name) return 'Imię jest wymagane'
  if (name.length < 2) return 'Imię musi mieć minimum 2 znaki'
  return ''
}

export const validatePasswordConfirmation = (password: string, confirmation: string) => {
  if (!confirmation) return 'Potwierdzenie hasła jest wymagane'
  if (password !== confirmation) return 'Hasła nie są identyczne'
  return ''
} 