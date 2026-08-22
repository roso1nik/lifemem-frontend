export interface User {
    id: string
    createdAt: string
    updatedAt: string
    nickname: string
    passwordId: string
    email: string
    phoneNumber: string | null
    isEmailVerified: boolean
    isPhoneVerified: boolean
    roleId: string
    deletedAt: string | null
}

export type { LoginRequest, RegisterRequest, ConfirmEmailRequest, ForgotPasswordRequest, AuthTokens } from './auth'
export {
    loginSchema,
    registerSchema,
    confirmEmailSchema,
    forgotPasswordSchema
} from './auth'
