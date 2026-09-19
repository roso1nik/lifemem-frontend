import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { useRouter } from '@/i18n/navigation'
import { createUserSettingsSchema } from '@/entities/user/api/use-register'
import { LoginResponse } from '../use-login'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { completeOAuthLogin } from '@/shared/lib/oauth'
import { logLoginAttempt, logLoginError, logLoginSuccess } from '../log-login'

export const googleAuthSchema = z.object({
    idToken: z.string().min(1),
    nickname: z.string().min(2),
    initSettings: createUserSettingsSchema
})

export type GoogleAuthRequest = z.infer<typeof googleAuthSchema>

export const googleLogin = async (data: GoogleAuthRequest): AxiosPromise<LoginResponse> => {
    const res = await apiClient.post('/auth/google/login', data)
    return res
}

export const useGoogleLogin = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.GOOGLE_LOGIN],
        mutationFn: (data: GoogleAuthRequest) => {
            logLoginAttempt({ kind: 'oauth', method: 'google' })
            return googleLogin(data)
        },
        onSuccess: () => {
            logLoginSuccess({ kind: 'oauth', method: 'google' })
            completeOAuthLogin(queryClient, router, t('success.login'))
        },
        onError: (error) => {
            const reason = getApiErrorMessage(error, t('errors.oauthLogin'))
            logLoginError({ kind: 'oauth', method: 'google' }, reason)
            toast.error(reason)
        }
    })
}
