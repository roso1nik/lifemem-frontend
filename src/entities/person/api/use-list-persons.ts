import { AxiosPromise } from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchResponse } from '@/shared/types'
import { Person } from '../model'

export type PersonListParams = {
    query?: string
    page?: number
    count?: number
}

export type PersonListResponse = SearchResponse<Person>

const DEFAULT_COUNT = 20

export const listPersons = async (params: PersonListParams = {}): AxiosPromise<PersonListResponse> => {
    const res = await apiClient.get('/person', {
        params: {
            query: params.query || undefined,
            page: params.page ?? 1,
            count: params.count ?? DEFAULT_COUNT
        }
    })
    return res
}

export type UseListPersonsParams = {
    query?: string
    count?: number
}

export const useListPersons = ({ query, count = DEFAULT_COUNT }: UseListPersonsParams = {}) =>
    useInfiniteQuery({
        queryKey: [ApiQueryKeys.PERSON_LIST, { query: query || '', count }],
        queryFn: ({ pageParam }) => listPersons({ query, page: pageParam, count }).then((res) => res.data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
            return loaded < lastPage.count ? allPages.length + 1 : undefined
        }
    })
