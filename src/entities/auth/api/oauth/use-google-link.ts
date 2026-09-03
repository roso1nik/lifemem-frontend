import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const googleLinkSchema = z.object({
    idToken: z.string().min(1)
})

export type GoogleLinkRequest = z.infer<typeof googleLinkSchema>

export const googleLink = async (data: GoogleLinkRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/auth/google/link', data)
    return res
}

export const useGoogleLink = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.GOOGLE_LINK],
        mutationFn: (data: GoogleLinkRequest) => googleLink(data),
        onSuccess: (response) => toast.success(response.data.message || 'Google привязан'),
        onError: () => toast.error('Не удалось привязать Google')
    })
