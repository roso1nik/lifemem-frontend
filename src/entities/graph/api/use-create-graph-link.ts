import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import apiClient, { getApiErrorMessage } from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

export const createGraphLinkSchema = z.object({
    entryAId: z.string().uuid(),
    entryBId: z.string().uuid()
})

export type CreateGraphLinkRequest = z.infer<typeof createGraphLinkSchema>

export type GraphLink = {
    entryAId: string
    entryBId: string
    createdAt: string
}

export const createGraphLink = async (data: CreateGraphLinkRequest): AxiosPromise<GraphLink> => {
    const parsed = createGraphLinkSchema.parse(data)
    const res = await apiClient.post('/graph/links', parsed)
    return res
}

export const useCreateGraphLink = () => {
    const queryClient = useQueryClient()
    const t = useTranslations('home.graphPage')

    return useMutation({
        mutationKey: [ApiQueryKeys.CREATE_GRAPH_LINK],
        mutationFn: (data: CreateGraphLinkRequest) => createGraphLink(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.GRAPH] })
            toast.success(t('linkCreated'))
        },
        onError: (error) => toast.error(getApiErrorMessage(error, t('linkFailed')))
    })
}
