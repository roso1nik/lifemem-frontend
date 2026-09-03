import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const addPhoneSchema = z.object({
    phoneNumber: z.string().min(1)
})

export type AddPhoneRequest = z.infer<typeof addPhoneSchema>

export const addPhone = async (data: AddPhoneRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/user/add-phone', data)
    return res
}

export const useAddPhone = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ADD_PHONE],
        mutationFn: (data: AddPhoneRequest) => addPhone(data),
        onSuccess: (response) => toast.success(response.data.message || 'Телефон добавлен'),
        onError: () => toast.error('Не удалось добавить телефон')
    })
