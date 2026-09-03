import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { LoginResponse } from './use-login'
import { useTranslations } from 'next-intl'

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
    const queryClient = useQueryClient()
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.CONFIRM_PHONE_LOGIN],
        mutationFn: (data: ConfirmPhoneLoginRequest) => confirmPhoneLogin(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
            toast.success(t('success.login'))
            router.replace(ROUTES.HOME_PAGE)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.confirmCode')))
    })
}
