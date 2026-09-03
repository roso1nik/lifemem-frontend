import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
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

export const useUpdateUser = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_UPDATE],
        mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserRequest }) => updateUser(id, data),
        onSuccess: () => toast.success('Пользователь обновлён'),
        onError: () => toast.error('Не удалось обновить пользователя')
    })

export const softDeleteUser = async (id: string): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete(`/admin/user/${id}/soft`)
    return res
}

export const useSoftDeleteUser = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_SOFT_DELETE],
        mutationFn: (id: string) => softDeleteUser(id),
        onSuccess: (response) => toast.success(response.data.message || 'Пользователь удалён'),
        onError: () => toast.error('Не удалось удалить пользователя')
    })

export const hardDeleteUser = async (id: string): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete(`/admin/user/${id}/hard`)
    return res
}

export const useHardDeleteUser = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_HARD_DELETE],
        mutationFn: (id: string) => hardDeleteUser(id),
        onSuccess: (response) => toast.success(response.data.message || 'Пользователь удалён навсегда'),
        onError: () => toast.error('Не удалось удалить пользователя')
    })
