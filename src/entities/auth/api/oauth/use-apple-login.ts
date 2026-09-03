import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { createUserSettingsSchema } from '@/entities/user/api/use-register'
import { LoginResponse } from '../use-login'

export const appleAuthSchema = z.object({
    idToken: z.string().min(1),
    nickname: z.string().min(2),
    initSettings: createUserSettingsSchema
})

export type AppleAuthRequest = z.infer<typeof appleAuthSchema>

export const appleLogin = async (data: AppleAuthRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/apple/login', data)
    return res
}

export const useAppleLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.APPLE_LOGIN],
        mutationFn: (data: AppleAuthRequest) => appleLogin(data),
        onSuccess: (response) => {
            if (response.data.accessToken) Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, response.data.accessToken)
            if (response.data.refreshToken) Cookies.set(GLOBAL_DICTIONARY.REFRESH_TOKEN, response.data.refreshToken)
            toast.success('Вход выполнен')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Не удалось войти через Apple')
    })
}
