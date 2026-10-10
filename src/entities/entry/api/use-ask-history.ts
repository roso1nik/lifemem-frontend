import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SearchResponse, SortDirection } from '@/shared/types'
import { EntryRagSource } from './use-ask-entry'

export type EntryAskHistoryFilter = Record<string, never>

export interface EntryAskHistorySort {
    createdAt?: SortDirection
}

export type EntryAskHistorySearchRequest = SearchRequest<EntryAskHistoryFilter, EntryAskHistorySort>

export interface EntryAskHistoryItem {
    id: string
    question: string | null
    answer: string | null
    createdAt: string
    sources: EntryRagSource[]
}

export type EntryAskHistorySearchResponse = SearchResponse<EntryAskHistoryItem>

const normalizeSnippet = (value: unknown): string | null => {
    if (typeof value === 'string') return value
    if (value == null) return null
    return null
}

export const searchAskHistory = async (
    data: EntryAskHistorySearchRequest
): AxiosPromise<EntryAskHistorySearchResponse> => {
    const res = await apiClient.post<EntryAskHistorySearchResponse>('/entry/ask/history', data)
    res.data = {
        count: res.data.count,
        data: (res.data.data ?? []).map((item) => ({
            ...item,
            sources: (item.sources ?? []).map((source) => ({
                ...source,
                textSnippet: normalizeSnippet(source.textSnippet)
            }))
        }))
    }
    return res
}

export const useSearchAskHistory = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ASK_ENTRY_HISTORY],
        mutationFn: (data: EntryAskHistorySearchRequest) => searchAskHistory(data)
    })
