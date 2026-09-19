import { AxiosPromise } from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { SearchResponse } from '@/shared/types'
import { Place } from '../model'

export type PlaceListParams = {
    query?: string
    page?: number
    count?: number
}

export type PlaceListResponse = SearchResponse<Place>

const DEFAULT_COUNT = 20

export const listPlaces = async (params: PlaceListParams = {}): AxiosPromise<PlaceListResponse> => {
    const res = await apiClient.get('/place', {
        params: {
            query: params.query || undefined,
            page: params.page ?? 1,
            count: params.count ?? DEFAULT_COUNT
        }
    })
    return res
}

export type UseListPlacesParams = {
    query?: string
    count?: number
}

export const useListPlaces = ({ query, count = DEFAULT_COUNT }: UseListPlacesParams = {}) =>
    useInfiniteQuery({
        queryKey: [ApiQueryKeys.PLACE_LIST, { query: query || '', count }],
        queryFn: ({ pageParam }) => listPlaces({ query, page: pageParam, count }).then((res) => res.data),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
            return loaded < lastPage.count ? allPages.length + 1 : undefined
        }
    })
