import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const telegramUnlink = async (): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete('/auth/telegram/unlink')
    return res
}

export const useTelegramUnlink = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.TELEGRAM_UNLINK],
        mutationFn: () => telegramUnlink(),
        onSuccess: (response) => toast.success(response.data.message || 'Telegram отвязан'),
        onError: () => toast.error('Не удалось отвязать Telegram')
    })
