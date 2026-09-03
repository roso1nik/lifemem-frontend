import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchRequest, SortDirection, SearchResponse } from '@/shared/types'
import { User } from '@/entities/user/model'

export interface UserAdminFilter {
    nickname?: string
    email?: string
    phoneNumber?: string
    isEmailVerified?: boolean
    isPhoneVerified?: boolean
    roleId?: string
}

export interface UserAdminSort {
    createdAt?: SortDirection
}

export type UserAdminSearchRequest = SearchRequest<UserAdminFilter, UserAdminSort>

export type UserAdminSearchResponse = SearchResponse<User>

export const searchUsers = async (data: UserAdminSearchRequest): AxiosPromise<UserAdminSearchResponse> => {
    const res = await apiClient.post('/admin/user/search', data)
    return res
}

export const useSearchUsers = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.ADMIN_USER_SEARCH],
        mutationFn: (data: UserAdminSearchRequest) => searchUsers(data)
    })
