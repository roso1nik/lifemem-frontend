import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { User } from '../model'
import { useTranslations } from 'next-intl'

export const confirmPhoneSchema = z.object({
    phone: z.string().min(1),
    code: z.string().min(4).max(8).regex(/^\d+$/)
})

export type ConfirmPhoneRequest = z.infer<typeof confirmPhoneSchema>

export const confirmPhone = async (data: ConfirmPhoneRequest): AxiosPromise<User> => {
    const res = await apiClient.post('/user/confirm-phone', data)
    return res
}

export const useConfirmPhone = () => {
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_PHONE],
        mutationFn: (data: ConfirmPhoneRequest) => confirmPhone(data),
        onSuccess: () => toast.success(t('success.phoneConfirmed')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.confirmCode')))
    })
}
