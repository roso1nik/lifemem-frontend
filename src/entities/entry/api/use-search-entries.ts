import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SearchResponse, SortDirection } from '@/shared/types'
import { EntrySearchItem } from '../model'

export type EntrySearchType = 'voice' | 'text'

export interface EntrySearchDateRange {
    from?: string
    to?: string
}

export interface EntrySearchFilter {
    title?: string
    type?: EntrySearchType
    isReady?: boolean
    hasMedia?: boolean
    peopleIds?: string[]
    placeIds?: string[]
    createdAt?: EntrySearchDateRange
}

export interface EntrySearchSort {
    createdAt?: SortDirection
}

export type EntrySearchRequest = SearchRequest<EntrySearchFilter, EntrySearchSort>

export type EntrySearchResponse = SearchResponse<EntrySearchItem>

export const DEFAULT_ENTRY_SEARCH: EntrySearchRequest = {
    pagination: { page: 1, count: 50 },
    sorts: { createdAt: 'DESC' }
}

export const searchEntries = async (
    data: EntrySearchRequest = DEFAULT_ENTRY_SEARCH
): AxiosPromise<EntrySearchResponse> => {
    const res = await apiClient.post('/entry/search', data)
    return res
}

export type UseSearchEntriesParams = {
    query?: string
    filters?: EntrySearchFilter
    page?: number
    count?: number
    enabled?: boolean
}

export const useSearchEntries = ({
    query,
    filters,
    page = 1,
    count = 50,
    enabled = true
}: UseSearchEntriesParams = {}) =>
    useQuery({
        queryKey: [
            ApiQueryKeys.ENTRY_SEARCH,
            {
                query: query || '',
                filters: filters ?? {},
                page,
                count
            }
        ],
        queryFn: () =>
            searchEntries({
                query: query?.trim() || undefined,
                filters,
                pagination: { page, count },
                sorts: { createdAt: 'DESC' }
            }).then((res) => res.data),
        enabled,
        staleTime: 30_000,
        refetchInterval: (q) => {
            const items = q.state.data?.data ?? []
            return items.some((item) => !item.isReady) ? 4000 : false
        }
    })
