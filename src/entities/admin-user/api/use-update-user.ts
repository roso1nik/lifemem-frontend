import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'
import { User } from '@/entities/user/model'

export const adminUpdateUserSchema = z.object({
    nickname: z.string().optional(),
    email: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    isEmailVerified: z.boolean().optional(),
    isPhoneVerified: z.boolean().optional(),
    roleId: z.string().uuid().optional()
})

export type AdminUpdateUserRequest = z.infer<typeof adminUpdateUserSchema>

export const updateUser = async (id: string, data: AdminUpdateUserRequest): AxiosPromise<User> => {
    const res = await apiClient.patch(`/admin/user/${id}`, data)
    return res
}

export const useUpdateUser = () => {
    const t = useTranslations('admin')

    return useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_UPDATE],
        mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserRequest }) => updateUser(id, data),
        onSuccess: () => toast.success(t('toast.userUpdated')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('toast.userUpdateFailed')))
    })
}

export const softDeleteUser = async (id: string): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete(`/admin/user/${id}/soft`)
    return res
}

export const useSoftDeleteUser = () => {
    const t = useTranslations('admin')

    return useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_SOFT_DELETE],
        mutationFn: (id: string) => softDeleteUser(id),
        onSuccess: (response) => toast.success(response.data.message || t('toast.userSoftDeleted')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('toast.userDeleteFailed')))
    })
}

export const hardDeleteUser = async (id: string): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete(`/admin/user/${id}/hard`)
    return res
}

export const useHardDeleteUser = () => {
    const t = useTranslations('admin')

    return useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_HARD_DELETE],
        mutationFn: (id: string) => hardDeleteUser(id),
        onSuccess: (response) => toast.success(response.data.message || t('toast.userHardDeleted')),
        onError: (error) => toast.error(getApiErrorMessage(error, t('toast.userDeleteFailed')))
    })
}
