import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { useTranslations } from 'next-intl'
import { completeOAuthLink } from '@/shared/lib/oauth'

export const appleLinkSchema = z.object({
    idToken: z.string().min(1)
})

export type AppleLinkRequest = z.infer<typeof appleLinkSchema>

export const appleLink = async (data: AppleLinkRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/auth/apple/link', data)
    return res
}

export const useAppleLink = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.APPLE_LINK],
        mutationFn: (data: AppleLinkRequest) => appleLink(data),
        onSuccess: (response) => {
            completeOAuthLink(queryClient)
            toast.success(response.data.message || t('success.appleLinked'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.appleLink')))
    })
}
