import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const appleLinkSchema = z.object({
    idToken: z.string().min(1)
})

export type AppleLinkRequest = z.infer<typeof appleLinkSchema>

export const appleLink = async (data: AppleLinkRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/auth/apple/link', data)
    return res
}

export const useAppleLink = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.APPLE_LINK],
        mutationFn: (data: AppleLinkRequest) => appleLink(data),
        onSuccess: (response) => toast.success(response.data.message || 'Apple привязан'),
        onError: () => toast.error('Не удалось привязать Apple')
    })
