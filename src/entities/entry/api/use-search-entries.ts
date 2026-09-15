import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SearchResponse, SortDirection } from '@/shared/types'
import { EntrySearchItem } from '../model'

export interface EntrySearchFilter {
    isReady?: boolean
}

export interface EntrySearchSort {
    createdAt?: SortDirection
}

export type EntrySearchRequest = SearchRequest<EntrySearchFilter, EntrySearchSort>

export type EntrySearchResponse = SearchResponse<EntrySearchItem>

const DEFAULT_SEARCH: EntrySearchRequest = {
    pagination: { page: 1, count: 50 },
    sorts: { createdAt: 'DESC' }
}

export const searchEntries = async (
    data: EntrySearchRequest = DEFAULT_SEARCH
): AxiosPromise<EntrySearchResponse> => {
    const res = await apiClient.post('/entry/search', data)
    return res
}

export const useSearchEntries = () =>
    useQuery({
        queryKey: [ApiQueryKeys.ENTRY_SEARCH],
        queryFn: () => searchEntries().then((res) => res.data),
        staleTime: Infinity
    })
