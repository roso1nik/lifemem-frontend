import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto, emailSchema } from '@/shared/types'
import { useTranslations } from 'next-intl'

export const requestPasswordResetSchema = z.object({
    email: emailSchema
})

export type RequestPasswordResetRequest = z.infer<typeof requestPasswordResetSchema>

export const confirmPasswordResetSchema = z.object({
    email: emailSchema,
    code: z.string().min(4).max(8),
    newPassword: z.string().min(8)
})

export type ConfirmPasswordResetRequest = z.infer<typeof confirmPasswordResetSchema>

export const requestPasswordReset = async (
    data: RequestPasswordResetRequest
): AxiosPromise<AlertBaseDto> => {
    const parsed = requestPasswordResetSchema.parse(data)
    const res = await apiClient.post('/auth/password-reset/request', parsed)
    return res
}

export const confirmPasswordReset = async (
    data: ConfirmPasswordResetRequest
): AxiosPromise<AlertBaseDto | void> => {
    const parsed = confirmPasswordResetSchema.parse(data)
    const res = await apiClient.post('/auth/password-reset/confirm', parsed)
    return res
}

export const useRequestPasswordReset = () => {
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.PASSWORD_RESET_REQUEST],
        mutationFn: (data: RequestPasswordResetRequest) =>
            requestPasswordReset(data).then((res) => res.data),
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.passwordResetRequest')))
    })
}

export const useConfirmPasswordReset = () => {
    const t = useTranslations('auth')

    return useMutation({
        mutationKey: [ApiQueryKeys.PASSWORD_RESET_CONFIRM],
        mutationFn: (data: ConfirmPasswordResetRequest) =>
            confirmPasswordReset(data).then((res) => res.data),
        onError: (error) => toast.error(getApiErrorMessage(error, t('errors.passwordResetConfirm')))
    })
}
