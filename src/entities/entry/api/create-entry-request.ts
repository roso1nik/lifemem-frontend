import z from 'zod'
import { AxiosPromise } from 'axios'
import apiClient from '@/shared/api'
import { EntryImage } from '../model'

export const entryLocationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    locationLabel: z.string().optional()
})

export type EntryLocationInput = z.infer<typeof entryLocationSchema>

export const createEntrySchema = z
    .object({
        title: z.string().optional(),
        text: z.string().optional(),
        voice: z.instanceof(Blob).optional(),
        photos: z.array(z.instanceof(Blob)).max(5).optional(),
        photoDescriptions: z.array(z.string().nullable()).optional(),
        location: z.array(entryLocationSchema).max(3).optional(),
        personIds: z.array(z.string().uuid()).optional(),
        placeIds: z.array(z.string().uuid()).max(3).optional()
    })
    .refine((data) => Boolean(data.text?.trim()) || Boolean(data.voice), {
        message: 'Укажите текст или голосовую заметку'
    })

export type CreateEntryRequest = z.infer<typeof createEntrySchema>

export interface EntryPlacesResponse {
    ready: number
    processing: number
}

export interface CreateEntryResponse {
    id: string
    images: EntryImage[]
    places: EntryPlacesResponse
}

const buildCreateEntryFormData = (data: CreateEntryRequest): FormData => {
    const form = new FormData()

    if (data.title) form.append('title', data.title)
    if (data.text) form.append('text', data.text)
    if (data.voice) form.append('voice', data.voice)
    if (data.location?.length) form.append('location', JSON.stringify(data.location))
    if (data.personIds?.length) form.append('personIds', JSON.stringify(data.personIds))
    if (data.placeIds?.length) form.append('placeIds', JSON.stringify(data.placeIds))
    if (data.photoDescriptions?.length) {
        form.append('photoDescriptions', JSON.stringify(data.photoDescriptions))
    }
    data.photos?.forEach((photo) => form.append('photos', photo))

    return form
}

export const createEntry = async (data: CreateEntryRequest): AxiosPromise<CreateEntryResponse> => {
    const res = await apiClient.post('/entry', buildCreateEntryFormData(data), {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res
}
