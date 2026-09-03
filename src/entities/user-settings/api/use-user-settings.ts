import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { UserSettings } from '../model'

export const userSettingsUpdateSchema = z.object({
    enableNotification: z.boolean().optional(),
    lang: z.string().optional()
})

export type UserSettingsUpdateRequest = z.infer<typeof userSettingsUpdateSchema>

export const getUserSettings = async (): AxiosPromise<UserSettings> => {
    const res = await apiClient.get('/user-settings')
    return res
}

export const useGetUserSettings = () =>
    useQuery({
        queryKey: [ApiQueryKeys.USER_SETTINGS],
        queryFn: () => getUserSettings().then((res) => res.data)
    })

export const updateUserSettings = async (data: UserSettingsUpdateRequest): AxiosPromise<UserSettings> => {
    const res = await apiClient.patch('/user-settings', data)
    return res
}

export const useUpdateUserSettings = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_USER_SETTINGS],
        mutationFn: (data: UserSettingsUpdateRequest) => updateUserSettings(data),
        onSuccess: (response) => {
            queryClient.setQueryData([ApiQueryKeys.USER_SETTINGS], response.data)
            toast.success('Настройки сохранены')
        },
        onError: () => toast.error('Не удалось сохранить настройки')
    })
}
