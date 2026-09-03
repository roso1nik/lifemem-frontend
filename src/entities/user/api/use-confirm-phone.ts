import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const confirmPhoneSchema = z.object({
    phone: z.string().min(1),
    code: z.string().min(4).max(8).regex(/^\d+$/)
})

export type ConfirmPhoneRequest = z.infer<typeof confirmPhoneSchema>

export const confirmPhone = async (data: ConfirmPhoneRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/user/confirm-phone', data)
    return res
}

export const useConfirmPhone = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_PHONE],
        mutationFn: (data: ConfirmPhoneRequest) => confirmPhone(data),
        onSuccess: (response) => toast.success(response.data.message || 'Телефон подтверждён'),
        onError: () => toast.error('Неверный код')
    })
