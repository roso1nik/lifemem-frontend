import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { Entry } from '../model'
import { entryLocationSchema } from './use-create-entry'

export const updateEntrySchema = z
    .object({
        title: z.string().optional(),
        peoples: z.array(z.string().uuid()).max(10).optional(),
        places: z.array(z.string().uuid()).max(3).optional(),
        location: z.array(entryLocationSchema).max(3).optional()
    })
    .superRefine((data, ctx) => {
        const placeSlots = (data.places?.length ?? 0) + (data.location?.length ?? 0)
        if (placeSlots > 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'too_many_places',
                path: ['places']
            })
        }
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
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, response.data.id] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            toast.success('Заметка обновлена')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось обновить заметку'))
    })
}
