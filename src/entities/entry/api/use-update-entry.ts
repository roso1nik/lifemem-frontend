import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { Entry } from '../model'

export const updateEntrySchema = z.object({
    title: z.string().optional(),
    peoples: z.array(z.string().uuid()).optional(),
    places: z.array(z.string().uuid()).max(3).optional()
})

export type UpdateEntryRequest = z.infer<typeof updateEntrySchema>

export const updateEntry = async (id: string, data: UpdateEntryRequest): AxiosPromise<Entry> => {
    const res = await apiClient.patch(`/entry/${id}/base`, data)
    return res
}

export const useUpdateEntry = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_ENTRY],
        mutationFn: ({ id, data }: { id: string; data: UpdateEntryRequest }) => updateEntry(id, data),
        onSuccess: (response) => {
            queryClient.setQueryData<Entry[]>([ApiQueryKeys.ENTRIES], (prev = []) =>
                prev.map((entry) => (entry.id === response.data.id ? response.data : entry))
            )
            toast.success('Заметка обновлена')
        },
        onError: () => toast.error('Не удалось обновить заметку')
    })
}
