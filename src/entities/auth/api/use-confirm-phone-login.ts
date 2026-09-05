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
import { logLoginAttempt, logLoginError, logLoginSuccess } from './log-login'

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
        mutationFn: (data: ConfirmPhoneLoginRequest) => {
            logLoginAttempt({ kind: 'phone', phone: data.phone })
            return confirmPhoneLogin(data)
        },
        onSuccess: (_response, variables) => {
            logLoginSuccess({ kind: 'phone', phone: variables.phone })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
            toast.success(t('success.login'))
            router.replace(ROUTES.HOME_PAGE)
        },
        onError: (error, variables) => {
            const reason = getApiErrorMessage(error, t('errors.confirmCode'))
            logLoginError({ kind: 'phone', phone: variables.phone }, reason)
            toast.error(reason)
        }
    })
}
