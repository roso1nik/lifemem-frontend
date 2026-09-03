import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { useTranslations } from 'next-intl'

export const softDeleteUser = async (): AxiosPromise<void> => {
    const res = await apiClient.delete('/user/soft')
    return res
}

export const useSoftDeleteUser = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.SOFT_DELETE_USER],
        mutationFn: () => softDeleteUser(),
        onSuccess: () => {
            queryClient.clear()
            toast.success(t('success.deleted'))
            router.replace(ROUTES.WELCOME)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.delete')))
    })
}
