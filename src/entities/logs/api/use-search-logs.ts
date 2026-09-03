import { AxiosPromise } from 'axios'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SortDirection, SearchResponse } from '@/shared/types'
import { LogEntry } from '../model'

export interface LogsFilter {
    path?: string
    userId?: string
    method?: string
    code?: number
}

export interface LogsSort {
    createdAt?: SortDirection
}

export type LogsSearchRequest = SearchRequest<LogsFilter, LogsSort>

export type LogsSearchResponse = SearchResponse<LogEntry>

export const searchLogs = async (data: LogsSearchRequest): AxiosPromise<LogsSearchResponse> => {
    const res = await apiClient.post('/logs/search', data)
    return res
}

export const useSearchLogs = (request: LogsSearchRequest) =>
    useQuery({
        queryKey: [ApiQueryKeys.LOGS_SEARCH, request],
        queryFn: () => searchLogs(request).then((res) => res.data),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        gcTime: Infinity
    })
