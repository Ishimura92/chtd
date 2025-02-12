import { configure } from 'vee-validate'
import { setLocale } from 'yup'
import * as yup from 'yup'

// Konfiguracja polskich komunikatów dla Yup
setLocale({
  mixed: {
    required: 'To pole jest wymagane',
  },
  string: {
    email: 'Nieprawidłowy format adresu email',
    min: ({ min }) => `Minimalna długość to ${min} znaków`,
  },
})

// Schemat walidacji dla logowania
export const loginSchema = yup.object({
  email: yup.string()
    .required()
    .email(),
  password: yup.string()
    .required()
    .min(8)
})

// Schemat walidacji dla rejestracji
export const registerSchema = yup.object({
  name: yup.string()
    .required()
    .min(2, 'Imię musi mieć co najmniej 2 znaki'),
  surname: yup.string()
    .required()
    .min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  email: yup.string()
    .required()
    .email(),
  password: yup.string()
    .required()
    .min(8)
    .matches(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .matches(/[0-9]/, 'Hasło musi zawierać cyfrę')
    .matches(/[!@#$%^&*]/, 'Hasło musi zawierać znak specjalny'),
  password_confirmation: yup.string()
    .required()
    .oneOf([yup.ref('password')], 'Hasła muszą być identyczne')
})

// Konfiguracja globalna
configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
}) 