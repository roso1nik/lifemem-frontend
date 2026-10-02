import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { Entry } from '../model'
import { entryLocationSchema } from './use-create-entry'

const idListSchema = z.array(z.string().min(1)).max(10)

export const updateEntrySchema = z
    .object({
        title: z.string().optional(),
        peoples: idListSchema.optional(),
        places: z.array(z.string().min(1)).max(3).optional(),
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

const buildUpdatePayload = (data: UpdateEntryRequest): Record<string, unknown> => {
    const payload: Record<string, unknown> = {}

    if (data.title !== undefined) payload.title = data.title

    // OpenAPI: peoples / places. Create uses personIds / placeIds — send both
    // so a DTO naming drift on the backend still links relations.
    if (data.peoples !== undefined) {
        payload.peoples = data.peoples
        payload.personIds = data.peoples
    }
    if (data.places !== undefined) {
        payload.places = data.places
        payload.placeIds = data.places
    }

    if (data.location?.length) {
        payload.location = data.location
            .filter((item) => item.latitude != null && item.longitude != null)
            .map((item) => ({
                latitude: item.latitude,
                longitude: item.longitude,
                ...(item.locationLabel ? { locationLabel: item.locationLabel } : {})
            }))
    }

    return payload
}

export const updateEntry = async (id: string, data: UpdateEntryRequest): AxiosPromise<Entry> => {
    const parsed = updateEntrySchema.parse(data)
    const res = await apiClient.patch(`/entry/${id}/base`, buildUpdatePayload(parsed))
    return res
}

export const useUpdateEntry = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_ENTRY],
        mutationFn: async ({ id, data }: { id: string; data: UpdateEntryRequest }) => {
            const res = await updateEntry(id, data)
            return res.data
        },
        onSuccess: (entry) => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, entry.id] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PERSON_LIST] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PLACE_LIST] })
            toast.success('Заметка обновлена')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось обновить заметку'))
    })
}
