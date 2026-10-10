import z from 'zod'
import { AxiosPromise } from 'axios'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { Entry } from '../model'

export const linkEntryPersonSchema = z.object({
    personId: z.string().uuid()
})

export type LinkEntryPersonRequest = z.infer<typeof linkEntryPersonSchema>

export const linkEntryPlaceSchema = z.object({
    placeId: z.string().uuid()
})

export type LinkEntryPlaceRequest = z.infer<typeof linkEntryPlaceSchema>

export const linkEntryPerson = async (
    entryId: string,
    data: LinkEntryPersonRequest
): AxiosPromise<Entry> => {
    const parsed = linkEntryPersonSchema.parse(data)
    const res = await apiClient.post(`/entry/${entryId}/people`, parsed)
    return res
}

export const unlinkEntryPerson = async (entryId: string, personId: string): AxiosPromise<Entry> => {
    const res = await apiClient.delete(`/entry/${entryId}/people/${personId}`)
    return res
}

export const linkEntryPlace = async (
    entryId: string,
    data: LinkEntryPlaceRequest
): AxiosPromise<Entry> => {
    const parsed = linkEntryPlaceSchema.parse(data)
    const res = await apiClient.post(`/entry/${entryId}/places`, parsed)
    return res
}

export const unlinkEntryPlace = async (entryId: string, placeId: string): AxiosPromise<Entry> => {
    const res = await apiClient.delete(`/entry/${entryId}/places/${placeId}`)
    return res
}

const invalidateEntryRelations = (queryClient: QueryClient, entryId: string) => {
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, entryId] })
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PERSON_LIST] })
    queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PLACE_LIST] })
}

export const useLinkEntryPerson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.LINK_ENTRY_PERSON],
        mutationFn: async ({ entryId, data }: { entryId: string; data: LinkEntryPersonRequest }) => {
            const res = await linkEntryPerson(entryId, data)
            return res.data
        },
        onSuccess: (_entry, variables) => {
            invalidateEntryRelations(queryClient, variables.entryId)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось привязать человека'))
    })
}

export const useUnlinkEntryPerson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UNLINK_ENTRY_PERSON],
        mutationFn: async ({ entryId, personId }: { entryId: string; personId: string }) => {
            const res = await unlinkEntryPerson(entryId, personId)
            return res.data
        },
        onSuccess: (_entry, variables) => {
            invalidateEntryRelations(queryClient, variables.entryId)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось отвязать человека'))
    })
}

export const useLinkEntryPlace = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.LINK_ENTRY_PLACE],
        mutationFn: async ({ entryId, data }: { entryId: string; data: LinkEntryPlaceRequest }) => {
            const res = await linkEntryPlace(entryId, data)
            return res.data
        },
        onSuccess: (_entry, variables) => {
            invalidateEntryRelations(queryClient, variables.entryId)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось привязать место'))
    })
}

export const useUnlinkEntryPlace = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UNLINK_ENTRY_PLACE],
        mutationFn: async ({ entryId, placeId }: { entryId: string; placeId: string }) => {
            const res = await unlinkEntryPlace(entryId, placeId)
            return res.data
        },
        onSuccess: (_entry, variables) => {
            invalidateEntryRelations(queryClient, variables.entryId)
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось отвязать место'))
    })
}
