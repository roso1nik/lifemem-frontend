import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { OptionalRefreshTokenRequest } from './use-refresh'

export const logout = async (data?: OptionalRefreshTokenRequest): AxiosPromise<void> => {
    const res = await apiClient.post('/auth/logout', data ?? {})
    return res
}

export const useLogout = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGOUT],
        mutationFn: (data?: OptionalRefreshTokenRequest) => logout(data),
        onSuccess: () => {
            Cookies.remove(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            Cookies.remove(GLOBAL_DICTIONARY.REFRESH_TOKEN)
            queryClient.clear()
            toast.success('Вы вышли')
            router.push(ROUTES.LOGIN)
        },
        onError: () => toast.error('Не удалось выйти')
    })
}
