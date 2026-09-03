import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { Self } from '../model'
import { useTranslations } from 'next-intl'

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
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_SELF],
        mutationFn: (data: UpdateSelfRequest) => updateSelf(data),
        onSuccess: (response) => {
            queryClient.setQueryData([ApiQueryKeys.GET_SELF], response.data)
            toast.success(t('success.nicknameUpdated'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.updateNickname')))
    })
}
