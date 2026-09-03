import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SortDirection, SearchResponse } from '@/shared/types'
import { AiModel, AiModelType } from '../model'

export interface AiModelFilter {
    type?: AiModelType
    isActive?: boolean
}

export interface AiModelSort {
    name?: SortDirection
}

export type AiModelSearchRequest = SearchRequest<AiModelFilter, AiModelSort>

export type AiModelSearchResponse = SearchResponse<AiModel>

export const aiModelUpdateSchema = z.object({
    isActive: z.boolean()
})

export type AiModelUpdateRequest = z.infer<typeof aiModelUpdateSchema>

export const searchAiModels = async (data: AiModelSearchRequest): AxiosPromise<AiModelSearchResponse> => {
    const res = await apiClient.post('/admin/ai-model/search', data)
    return res
}

export const useSearchAiModels = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.AI_MODEL_SEARCH],
        mutationFn: (data: AiModelSearchRequest) => searchAiModels(data)
    })

export const updateAiModel = async (id: string, data: AiModelUpdateRequest): AxiosPromise<AiModel> => {
    const res = await apiClient.patch(`/admin/ai-model/${id}`, data)
    return res
}

export const useUpdateAiModel = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.AI_MODEL_UPDATE],
        mutationFn: ({ id, data }: { id: string; data: AiModelUpdateRequest }) => updateAiModel(id, data),
        onSuccess: () => toast.success('Модель обновлена'),
        onError: () => toast.error('Не удалось обновить модель')
    })
