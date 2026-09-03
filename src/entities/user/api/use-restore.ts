import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const restoreUser = async (): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.post('/user/restore')
    return res
}

export const useRestoreUser = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.RESTORE_USER],
        mutationFn: () => restoreUser(),
        onSuccess: (response) => toast.success(response.data.message || 'Аккаунт восстановлен'),
        onError: () => toast.error('Не удалось восстановить аккаунт')
    })
