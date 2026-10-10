import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

export type NumberMinMaxFilter = {
    min?: number
    max?: number
}

export type PlaceMapEntry = {
    id: string
    name: string
}

export type PlaceMapItem = {
    id: string
    name: string
    fullName: string | null
    latitude: number
    longitude: number
    entries: PlaceMapEntry[]
}

export type PlaceMapRequest = {
    latitude?: NumberMinMaxFilter
    longitude?: NumberMinMaxFilter
    countries?: string[]
    regions?: string[]
    cities?: string[]
}

export type PlaceMapResponse = {
    data: PlaceMapItem[]
}

export const fetchPlaceMap = async (data: PlaceMapRequest = {}): AxiosPromise<PlaceMapResponse> => {
    const res = await apiClient.post('/place/map', data)
    return res
}

/** Full-world bbox so unfiltered map requests still return places. */
export const PLACE_MAP_WORLD_BOUNDS = {
    latitude: { min: -90, max: 90 },
    longitude: { min: -180, max: 180 }
} as const satisfies Pick<PlaceMapRequest, 'latitude' | 'longitude'>

export type UsePlaceMapParams = {
    countries?: string[]
    regions?: string[]
    cities?: string[]
    enabled?: boolean
}

export const usePlaceMap = ({
    countries,
    regions,
    cities,
    enabled = true
}: UsePlaceMapParams = {}) =>
    useQuery({
        queryKey: [
            ApiQueryKeys.PLACE_MAP,
            {
                countries: countries ?? [],
                regions: regions ?? [],
                cities: cities ?? []
            }
        ],
        queryFn: () => {
            const hasGeoFilter = Boolean(countries?.length || regions?.length || cities?.length)
            return fetchPlaceMap({
                // Backend returns an empty set for a bare `{}`; always scope the query.
                ...(hasGeoFilter ? {} : PLACE_MAP_WORLD_BOUNDS),
                ...(countries?.length ? { countries } : {}),
                ...(regions?.length ? { regions } : {}),
                ...(cities?.length ? { cities } : {})
            }).then((res) => res.data)
        },
        enabled
    })
