import { emailSchema } from '@/shared/types'
import z from 'zod'

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(6, 'Минимум 6 символов')
})

export type LoginRequest = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    nickname: z
        .string()
        .min(2, 'Минимум 2 символа')
        .max(32, 'Максимум 32 символа')
        .regex(/^[a-zA-Z0-9_]+$/, 'Только латиница, цифры и _'),
    email: emailSchema,
    password: z.string().min(6, 'Минимум 6 символов')
})

export type RegisterRequest = z.infer<typeof registerSchema>

export const confirmEmailSchema = z.object({
    code: z
        .string()
        .min(4, 'Введите код')
        .max(8, 'Слишком длинный код')
        .regex(/^\d+$/, 'Только цифры')
})

export type ConfirmEmailRequest = z.infer<typeof confirmEmailSchema>

export const forgotPasswordSchema = z.object({
    email: emailSchema
})

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>

export interface AuthTokens {
    accessToken: string
}
