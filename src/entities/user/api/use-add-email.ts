import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto, emailSchema } from '@/shared/types'

export const addEmailSchema = z.object({
    email: emailSchema,
    password: z.string().min(1)
})

export type AddEmailRequest = z.infer<typeof addEmailSchema>

export const addEmail = async (data: AddEmailRequest): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/user/add-email', data)
    return res
}

export const useAddEmail = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ADD_EMAIL],
        mutationFn: (data: AddEmailRequest) => addEmail(data),
        onSuccess: (response) => toast.success(response.data.message || 'Email добавлен'),
        onError: () => toast.error('Не удалось добавить email')
    })
