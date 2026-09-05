import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { emailSchema } from '@/shared/types'
import { User } from '@/entities/user/model'
import { useTranslations } from 'next-intl'
import {
    logLoginAttempt,
    logLoginCodeSent,
    logLoginError,
    logLoginSuccess,
    resolveLoginIdentity
} from './log-login'

export interface LoginResponse {
    user: User
    accessToken?: string
    refreshToken?: string
}

export type WebLoginResponse = {
    user: User
}

export interface LoginPhoneCodeResponse {
    message: string
    alert: boolean
}

export type LoginResult = LoginResponse | WebLoginResponse | LoginPhoneCodeResponse

export const loginSchema = z.object({
    email: emailSchema.optional(),
    password: z.string().optional(),
    phone: z.string().optional()
})

export type LoginRequest = z.infer<typeof loginSchema>

export const isPhoneCodeResponse = (data: LoginResult): data is LoginPhoneCodeResponse =>
    'message' in data && 'alert' in data && !('user' in data)

export const login = async (data: LoginRequest): AxiosPromise<LoginResult> => {
    const res = await apiClient.post('/auth/login', data)
    return res
}

export const useLogin = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.LOGIN],
        mutationFn: (data: LoginRequest) => {
            const identity = resolveLoginIdentity(data)
            if (identity) logLoginAttempt(identity)
            return login(data)
        },
        onSuccess: (response, variables) => {
            const data = response.data
            const identity = resolveLoginIdentity(variables)

            if (isPhoneCodeResponse(data)) {
                if (identity?.kind === 'phone') logLoginCodeSent(identity)
                toast.success(data.message || t('codeSent'))
                return
            }

            if (identity) logLoginSuccess(identity)
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GET_SELF] })
            toast.success(t('success.login'))
            router.replace(ROUTES.HOME_PAGE)
        },
        onError: (error, variables) => {
            const identity = resolveLoginIdentity(variables)
            const reason = getApiErrorMessage(error, t('errors.login'))
            if (identity) logLoginError(identity, reason)
            toast.error(reason)
        }
    })
}
