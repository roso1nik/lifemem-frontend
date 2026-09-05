import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { createUserSettingsSchema } from '@/entities/user/api/use-register'
import { LoginResponse } from '../use-login'
import { useTranslations } from 'next-intl'
import { completeOAuthLogin } from '@/shared/lib/oauth'
import { logLoginAttempt, logLoginError, logLoginSuccess } from '../log-login'

export const appleAuthSchema = z.object({
    idToken: z.string().min(1),
    nickname: z.string().min(2),
    initSettings: createUserSettingsSchema
})

export type AppleAuthRequest = z.infer<typeof appleAuthSchema>

export const appleLogin = async (data: AppleAuthRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/apple/login', data)
    return res
}

export const useAppleLogin = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.APPLE_LOGIN],
        mutationFn: (data: AppleAuthRequest) => {
            logLoginAttempt({ kind: 'oauth', method: 'apple' })
            return appleLogin(data)
        },
        onSuccess: () => {
            logLoginSuccess({ kind: 'oauth', method: 'apple' })
            completeOAuthLogin(queryClient, router, t('success.login'))
        },
        onError: (error) => {
            const reason = getApiErrorMessage(error, t('errors.oauthLogin'))
            logLoginError({ kind: 'oauth', method: 'apple' }, reason)
            toast.error(reason)
        }
    })
}
