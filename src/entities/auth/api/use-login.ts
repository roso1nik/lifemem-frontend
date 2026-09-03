import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { emailSchema } from '@/shared/types'
import { User } from '@/entities/user/model'

export interface LoginResponse {
    user: User
    accessToken?: string
    refreshToken?: string
}

export type WebLoginResponse = {
    user: User
}

export interface LoginPhoneCodeResponse {
    message: string
    alert: boolean
}

export type LoginResult = LoginResponse | WebLoginResponse | LoginPhoneCodeResponse

export const loginSchema = z.object({
    email: emailSchema.optional(),
    password: z.string().optional(),
    phone: z.string().optional()
})

export type LoginRequest = z.infer<typeof loginSchema>

const isPhoneCodeResponse = (data: LoginResult): data is LoginPhoneCodeResponse =>
    'message' in data && 'alert' in data && !('user' in data)

const saveTokensIfPresent = (data: LoginResult) => {
    if ('accessToken' in data && data.accessToken) {
        Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, data.accessToken)
    }
    if ('refreshToken' in data && data.refreshToken) {
        Cookies.set(GLOBAL_DICTIONARY.REFRESH_TOKEN, data.refreshToken)
    }
}

export const login = async (data: LoginRequest): AxiosPromise<LoginResult> => {
    const res = await apiClient.post('/auth/login', data)
    return res
}

export const useLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGIN],
        mutationFn: (data: LoginRequest) => login(data),
        onSuccess: (response) => {
            const data = response.data
            if (isPhoneCodeResponse(data)) {
                toast.success(data.message || 'Код отправлен')
                return
            }
            saveTokensIfPresent(data)
            toast.success('Вход выполнен')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Не удалось войти')
    })
}
