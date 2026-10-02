import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { EntryMedia, EntryVoice } from '../model'

export const entryLocationSchema = z
    .object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        locationLabel: z.string().optional()
    })
    .refine(
        (value) =>
            (value.latitude == null && value.longitude == null) ||
            (value.latitude != null && value.longitude != null),
        { message: 'latitude and longitude must both be set or both omitted' }
    )

export type EntryLocationInput = z.infer<typeof entryLocationSchema>

export const createEntryMediaItemSchema = z.object({
    id: z.string().uuid(),
    description: z.string().max(2000).nullable().optional()
})

export const createEntrySchema = z
    .object({
        title: z.string().optional(),
        text: z.string().optional(),
        audioId: z.string().uuid().nullable().optional(),
        media: z.array(createEntryMediaItemSchema).max(5).optional(),
        personIds: z.array(z.string().uuid()).max(10).optional(),
        placeIds: z.array(z.string().uuid()).max(3).optional(),
        location: z.array(entryLocationSchema).max(3).optional()
    })
    .superRefine((data, ctx) => {
        const hasText = Boolean(data.text?.trim())
        const hasAudio = Boolean(data.audioId)
        if (!hasText && !hasAudio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'text_or_voice_required',
                path: ['text']
            })
        }
        if (hasText && hasAudio) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'text_or_voice_only',
                path: ['audioId']
            })
        }
        const placeSlots = (data.placeIds?.length ?? 0) + (data.location?.length ?? 0)
        if (placeSlots > 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'too_many_places',
                path: ['placeIds']
            })
        }
    })

export type CreateEntryRequest = z.infer<typeof createEntrySchema>

export interface EntryPlacesResponse {
    ready: number
    processing: number
}

export interface CreateEntryResponse {
    id: string
    media: EntryMedia[]
    voice: EntryVoice | null
    places: EntryPlacesResponse
}

export const createEntry = async (data: CreateEntryRequest): AxiosPromise<CreateEntryResponse> => {
    const payload: Record<string, unknown> = {}
    if (data.title) payload.title = data.title
    if (data.text?.trim()) payload.text = data.text
    if (data.audioId) payload.audioId = data.audioId
    if (data.media?.length) payload.media = data.media
    if (data.personIds?.length) payload.personIds = data.personIds
    if (data.placeIds?.length) payload.placeIds = data.placeIds
    if (data.location?.length) {
        payload.location = data.location.map((item) => ({
            ...(item.latitude != null && item.longitude != null
                ? { latitude: item.latitude, longitude: item.longitude }
                : {}),
            ...(item.locationLabel ? { locationLabel: item.locationLabel } : {})
        }))
    }

    const res = await apiClient.post('/entry', payload)
    return res
}

export const useCreateEntry = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.CREATE_ENTRY],
        mutationFn: async (data: CreateEntryRequest) => {
            const parsed = createEntrySchema.safeParse(data)
            if (!parsed.success) {
                throw parsed.error
            }
            const res = await createEntry(parsed.data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось сохранить заметку'))
    })
}
