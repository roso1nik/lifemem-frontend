import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SortDirection, SearchResponse } from '@/shared/types'
import { AuthLog, AuthLogType } from '../model'

export interface AuthLogFilter {
    userId?: string
    type?: AuthLogType
}

export interface AuthLogSort {
    createdAt?: SortDirection
}

export type AuthLogSearchRequest = SearchRequest<AuthLogFilter, AuthLogSort>

export type AuthLogSearchResponse = SearchResponse<AuthLog>

export const searchAuthLogs = async (data: AuthLogSearchRequest): AxiosPromise<AuthLogSearchResponse> => {
    const res = await apiClient.post('/auth-log/search', data)
    return res
}

export const useSearchAuthLogs = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.AUTH_LOG_SEARCH],
        mutationFn: (data: AuthLogSearchRequest) => searchAuthLogs(data)
    })
