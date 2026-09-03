import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { emailSchema } from '@/shared/types'
import { User } from '../model'

export interface RegisterResponse {
    user: User
    message: string
    alert: boolean
}

export const createUserSettingsSchema = z.object({
    lang: z.string().optional()
})

export const createUserSchema = z.object({
    nickname: z.string().min(2).max(32),
    email: emailSchema.optional(),
    password: z.string().min(8).optional(),
    phoneNumber: z.string().optional(),
    initSettings: createUserSettingsSchema
})

export type CreateUserRequest = z.infer<typeof createUserSchema>

export { createUserSchema as registerSchema }
export type { CreateUserRequest as RegisterRequest }

export const register = async (data: CreateUserRequest): AxiosPromise<RegisterResponse> => {
    const res = await apiClient.post('/user', data)
    return res
}

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.REGISTER],
        mutationFn: (data: CreateUserRequest) => register(data),
        onSuccess: (response, variables) => {
            toast.success(response.data.message || 'Аккаунт создан')
            const email = variables.email ?? response.data.user.email
            if (email) {
                router.push(`${ROUTES.CONFIRM_PAGE}?email=${encodeURIComponent(email)}`)
            } else {
                router.push(ROUTES.LOGIN)
            }
        },
        onError: () => toast.error('Не удалось зарегистрироваться')
    })
}
