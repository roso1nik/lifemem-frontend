import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

const strongPassword = z
    .string()
    .min(8)
    .regex(/[a-z]/, 'lowercase')
    .regex(/[A-Z]/, 'uppercase')
    .regex(/[0-9]/, 'digit')
    .regex(/[^A-Za-z0-9]/, 'symbol')

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1),
    newPassword: strongPassword
})

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>

export const changePassword = async (data: ChangePasswordRequest): AxiosPromise<void> => {
    const parsed = changePasswordSchema.parse(data)
    const res = await apiClient.post('/auth/password', parsed)
    return res
}

export const useChangePassword = () => {
    const t = useTranslations('profile')

    return useMutation({
        mutationKey: [ApiQueryKeys.CHANGE_PASSWORD],
        mutationFn: (data: ChangePasswordRequest) => changePassword(data),
        onSuccess: () => toast.success(t('toast.passwordChanged')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('toast.passwordChangeFailed')))
    })
}
