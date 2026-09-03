import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { LoginResponse } from './use-login'

export const confirmPhoneLoginSchema = z.object({
    phone: z.string().min(1),
    code: z.string().min(4).max(8).regex(/^\d+$/)
})

export type ConfirmPhoneLoginRequest = z.infer<typeof confirmPhoneLoginSchema>

export const confirmPhoneLogin = async (data: ConfirmPhoneLoginRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/confirm-phone', data)

    return res
}

export const useConfirmPhoneLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_PHONE_LOGIN],
        mutationFn: (data: ConfirmPhoneLoginRequest) => confirmPhoneLogin(data),
        onSuccess: (data) => {
            if (data.data.accessToken) {
                Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, data.data.accessToken)
            }
            if (data.data.refreshToken) {
                Cookies.set(GLOBAL_DICTIONARY.REFRESH_TOKEN, data.data.refreshToken)
            }
            toast.success('Вход выполнен')
            router.push(ROUTES.HOME_PAGE)
        },
        onError: () => toast.error('Неверный код')
    })
}
