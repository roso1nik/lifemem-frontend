import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { useTranslations } from 'next-intl'
import { completeOAuthLink } from '@/shared/lib/oauth'

export const googleLinkSchema = z.object({
    idToken: z.string().min(1)
})

export type GoogleLinkRequest = z.infer<typeof googleLinkSchema>

export const googleLink = async (data: GoogleLinkRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/auth/google/link', data)
    return res
}

export const useGoogleLink = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.GOOGLE_LINK],
        mutationFn: (data: GoogleLinkRequest) => googleLink(data),
        onSuccess: (response) => {
            completeOAuthLink(queryClient)
            toast.success(response.data.message || t('success.googleLinked'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.googleLink')))
    })
}
