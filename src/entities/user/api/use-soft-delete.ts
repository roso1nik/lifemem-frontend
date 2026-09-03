import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const softDeleteUser = async (): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete('/user/soft')
    return res
}

export const useSoftDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.SOFT_DELETE_USER],
        mutationFn: () => softDeleteUser(),
        onSuccess: (response) => {
            queryClient.removeQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
            toast.success(response.data.message || 'Аккаунт удалён')
        },
        onError: () => toast.error('Не удалось удалить аккаунт')
    })
}
