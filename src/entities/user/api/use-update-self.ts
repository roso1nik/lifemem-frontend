import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { Self } from '../model'

export const updateSelfSchema = z.object({
    nickname: z.string().min(2).max(32)
})

export type UpdateSelfRequest = z.infer<typeof updateSelfSchema>

export const updateSelf = async (data: UpdateSelfRequest): AxiosPromise<Self> => {
    const res = await apiClient.patch('/user/me', data)
    return res
}

export const useUpdateSelf = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_SELF],
        mutationFn: (data: UpdateSelfRequest) => updateSelf(data),
        onSuccess: (response) => {
            queryClient.setQueryData([ApiQueryKeys.GET_SELF], response.data)
            toast.success('Профиль обновлён')
        },
        onError: () => toast.error('Не удалось обновить профиль')
    })
}
