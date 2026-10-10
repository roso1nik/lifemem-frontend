import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

export type PlaceMapCountry = {
    code: string
    name: string
}

export type PlaceMapFilters = {
    countries: PlaceMapCountry[]
    regions: string[]
    cities: string[]
}

export const fetchPlaceMapFilters = async (): AxiosPromise<PlaceMapFilters> => {
    const res = await apiClient.get('/place/map/filters')
    return res
}

export const usePlaceMapFilters = (enabled = true) =>
    useQuery({
        queryKey: [ApiQueryKeys.PLACE_MAP_FILTERS],
        queryFn: () => fetchPlaceMapFilters().then((res) => res.data),
        enabled,
        staleTime: 60_000
    })
