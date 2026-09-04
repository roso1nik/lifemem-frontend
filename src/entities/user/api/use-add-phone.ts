import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { isValidPhone } from '@/shared/utils'
import { useTranslations } from 'next-intl'

export const addPhoneSchema = z.object({
    phoneNumber: z.string().refine(isValidPhone)
})

export type AddPhoneRequest = z.infer<typeof addPhoneSchema>

export const addPhone = async (data: AddPhoneRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.patch('/user/add-phone', data)
    return res
}

export const useAddPhone = () => {
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.ADD_PHONE],
        mutationFn: (data: AddPhoneRequest) => addPhone(data),
        onSuccess: (response) => toast.success(response.data.message || t('success.phoneAdded')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.addPhone')))
    })
}
