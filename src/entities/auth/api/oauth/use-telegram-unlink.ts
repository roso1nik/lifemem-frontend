import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { useTranslations } from 'next-intl'
import { completeOAuthUnlink } from '@/shared/lib/oauth'

export const telegramUnlink = async (): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete('/auth/telegram/unlink')
    return res
}

export const useTelegramUnlink = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.TELEGRAM_UNLINK],
        mutationFn: () => telegramUnlink(),
        onSuccess: (response) => {
            completeOAuthUnlink(queryClient)
            toast.success(response.data.message || t('success.telegramUnlinked'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.telegramUnlink')))
    })
}
