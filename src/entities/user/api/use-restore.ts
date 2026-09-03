import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { User } from '../model'
import { useTranslations } from 'next-intl'

export const restoreUser = async (): AxiosPromise<User> => {
    const res = await apiClient.post('/user/restore')
    return res
}

export const useRestoreUser = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.RESTORE_USER],
        mutationFn: () => restoreUser(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
            toast.success(t('success.restored'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.restore')))
    })
}
