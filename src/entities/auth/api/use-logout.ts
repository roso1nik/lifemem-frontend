import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { OptionalRefreshTokenRequest } from './use-refresh'
import { useTranslations } from 'next-intl'
import { useWorkspaceTabs } from '@/features/workspace-tabs'

export const logout = async (data?: OptionalRefreshTokenRequest): AxiosPromise<void> => {
    const res = await apiClient.post('/auth/logout', data ?? {})
    return res
}

export const useLogout = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const t = useTranslations('auth')
    const bindUser = useWorkspaceTabs((s) => s.bindUser)

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGOUT],
        mutationFn: (data?: OptionalRefreshTokenRequest) => logout(data),
        onSuccess: () => {
            bindUser(null)
            Cookies.remove(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            Cookies.remove(GLOBAL_DICTIONARY.REFRESH_TOKEN)
            queryClient.clear()
            toast.success(t('success.logout'))
            router.replace(ROUTES.LOGIN)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.logout')))
    })
}
