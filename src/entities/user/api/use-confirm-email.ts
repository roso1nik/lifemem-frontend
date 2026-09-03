import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { emailSchema } from '@/shared/types'
import { User } from '../model'
import { useTranslations } from 'next-intl'

export const confirmEmailSchema = z.object({
    email: emailSchema,
    code: z.string().min(4).max(8).regex(/^\d+$/)
})

export type ConfirmEmailRequest = z.infer<typeof confirmEmailSchema>

export const confirmEmail = async (data: ConfirmEmailRequest): AxiosPromise<User> => {
    const res = await apiClient.post('/user/confirm-email', data)
    return res
}

export const useConfirmEmail = () => {
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_EMAIL],
        mutationFn: (data: ConfirmEmailRequest) => confirmEmail(data),
        onSuccess: () => toast.success(t('success.confirmEmail')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.confirmCode')))
    })
}
