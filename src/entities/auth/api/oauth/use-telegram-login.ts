import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { createUserSettingsSchema } from '@/entities/user/api/use-register'
import { LoginResponse } from '../use-login'
import { useTranslations } from 'next-intl'
import { completeOAuthLogin } from '@/shared/lib/oauth'

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
    const queryClient = useQueryClient()
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.TELEGRAM_LOGIN],
        mutationFn: (data: TelegramAuthRequest) => telegramLogin(data),
        onSuccess: () => completeOAuthLogin(queryClient, router, t('success.login')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.oauthLogin')))
    })
}
