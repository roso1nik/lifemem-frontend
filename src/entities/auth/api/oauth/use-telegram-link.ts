import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { telegramLoginDataSchema } from './use-telegram-login'

export const telegramLinkSchema = z.object({
    telegramData: telegramLoginDataSchema
})

export type TelegramLinkRequest = z.infer<typeof telegramLinkSchema>

export const telegramLink = async (data: TelegramLinkRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/auth/telegram/link', data)
    return res
}

export const useTelegramLink = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.TELEGRAM_LINK],
        mutationFn: (data: TelegramLinkRequest) => telegramLink(data),
        onSuccess: (response) => toast.success(response.data.message || 'Telegram привязан'),
        onError: () => toast.error('Не удалось привязать Telegram')
    })
