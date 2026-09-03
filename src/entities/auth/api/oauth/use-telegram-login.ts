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

export const telegramLoginDataSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string().optional(),
    username: z.string().optional(),
    photo_url: z.string().optional(),
    auth_date: z.number(),
    hash: z.string()
})

export type TelegramLoginData = z.infer<typeof telegramLoginDataSchema>

export const telegramAuthSchema = z.object({
    telegramData: telegramLoginDataSchema,
    nickname: z.string().min(2),
    initSettings: createUserSettingsSchema.optional()
})

export type TelegramAuthRequest = z.infer<typeof telegramAuthSchema>

export const telegramLogin = async (data: TelegramAuthRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/telegram/login', data)
    return res
}

export const useTelegramLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.TELEGRAM_LOGIN],
        mutationFn: (data: TelegramAuthRequest) => telegramLogin(data),
        onSuccess: (response) => {
            if (response.data.accessToken) Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, response.data.accessToken)
            if (response.data.refreshToken) Cookies.set(GLOBAL_DICTIONARY.REFRESH_TOKEN, response.data.refreshToken)
            toast.success('Вход выполнен')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Не удалось войти через Telegram')
    })
}
