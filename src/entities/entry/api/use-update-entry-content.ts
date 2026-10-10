import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { Entry } from '../model'

export const updateEntryContentSchema = z.object({
    title: z.string().optional(),
    text: z.string().optional(),
    formattedText: z.string().nullable().optional(),
    formattedTextFormat: z.enum(['plain', 'markdown', 'html']).nullable().optional()
})

export type UpdateEntryContentRequest = z.infer<typeof updateEntryContentSchema>

/** PATCH /entry/:id/content — полное обновление готовой заметки (isReady). */
export const updateEntryContent = async (
    id: string,
    data: UpdateEntryContentRequest
): AxiosPromise<Entry> => {
    const parsed = updateEntryContentSchema.parse(data)
    const res = await apiClient.patch(`/entry/${id}/content`, parsed)
    return res
}

export const useUpdateEntryContent = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.UPDATE_ENTRY_CONTENT],
        mutationFn: async ({ id, data }: { id: string; data: UpdateEntryContentRequest }) => {
            const res = await updateEntryContent(id, data)
            return res.data
        },
        onSuccess: (entry) => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, entry.id] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            toast.success('Заметка обновлена')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось обновить заметку'))
    })
}
