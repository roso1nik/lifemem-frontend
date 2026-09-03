import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { useTranslations } from 'next-intl'
import { completeOAuthLink } from '@/shared/lib/oauth'
import { telegramLoginDataSchema } from './use-telegram-login'

export const telegramLinkSchema = z.object({
    telegramData: telegramLoginDataSchema
})

export type TelegramLinkRequest = z.infer<typeof telegramLinkSchema>

export const telegramLink = async (data: TelegramLinkRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/auth/telegram/link', data)
    return res
}

export const useTelegramLink = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.TELEGRAM_LINK],
        mutationFn: (data: TelegramLinkRequest) => telegramLink(data),
        onSuccess: (response) => {
            completeOAuthLink(queryClient)
            toast.success(response.data.message || t('success.telegramLinked'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.telegramLink')))
    })
}
