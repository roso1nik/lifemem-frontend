import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { EntryMedia } from '../model'

export const attachEntryMediaSchema = z.object({
    fileId: z.string().uuid(),
    description: z.string().max(2000).nullable().optional()
})

export type AttachEntryMediaRequest = z.infer<typeof attachEntryMediaSchema>

export const attachEntryMedia = async (
    entryId: string,
    data: AttachEntryMediaRequest
): AxiosPromise<EntryMedia> => {
    const res = await apiClient.post(`/entry/${entryId}/media`, data)
    return res
}

export const detachEntryMedia = async (entryId: string, mediaId: string): AxiosPromise<void> => {
    const res = await apiClient.delete(`/entry/${entryId}/media/${mediaId}`)
    return res
}

export const useAttachEntryMedia = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.ATTACH_ENTRY_MEDIA],
        mutationFn: async ({ entryId, data }: { entryId: string; data: AttachEntryMediaRequest }) => {
            const parsed = attachEntryMediaSchema.safeParse(data)
            if (!parsed.success) throw parsed.error
            const res = await attachEntryMedia(entryId, parsed.data)
            return res.data
        },
        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, variables.entryId] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось прикрепить файл'))
    })
}

export const useDetachEntryMedia = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.DETACH_ENTRY_MEDIA],
        mutationFn: ({ entryId, mediaId }: { entryId: string; mediaId: string }) =>
            detachEntryMedia(entryId, mediaId),
        onSuccess: (_response, variables) => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, variables.entryId] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            toast.success('Медиа удалено')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось открепить файл'))
    })
}
