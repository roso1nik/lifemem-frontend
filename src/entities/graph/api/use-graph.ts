import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

export type GraphNodeType = 'entry' | 'person' | 'place'

export type GraphEdgeType =
    | 'entry_person'
    | 'entry_place'
    | 'person_person'
    | 'place_place'
    | 'person_place'
    | 'entry_entry'
    | 'entry_entry_manual'

export type GraphEdgeReason = {
    score?: number
    textSim?: number | null
    titleSim?: number | null
    imageMaxSim?: number | null
    imageMatches?: number
    sharedPeopleIds?: string[]
    sharedPlaceIds?: string[]
    hoursApart?: number
    sharedEntries?: number
    weight?: number
    manual?: boolean
}

export type GraphNode = {
    id: string
    type: GraphNodeType
    name: string
    degree: number
    createdAt?: string
}

export type GraphEdge = {
    source: string
    target: string
    type: GraphEdgeType
    weight: number
    reason?: GraphEdgeReason
}

export type GraphDto = {
    formulaVersion: number
    builtAt: string
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export type GraphQueryParams = {
    orphans?: boolean
    types?: GraphNodeType[]
    query?: string
}

export const getGraph = async (params: GraphQueryParams = {}): AxiosPromise<GraphDto> => {
    const res = await apiClient.get('/graph', {
        params: {
            ...(params.orphans != null ? { orphans: params.orphans } : {}),
            ...(params.types?.length ? { types: params.types } : {}),
            ...(params.query?.trim() ? { query: params.query.trim() } : {})
        },
        paramsSerializer: {
            indexes: null
        }
    })
    return res
}

export const useGraph = (params: GraphQueryParams = {}) =>
    useQuery({
        queryKey: [
            ApiQueryKeys.GRAPH,
            {
                orphans: params.orphans ?? false,
                types: params.types ?? [],
                query: params.query?.trim() ?? ''
            }
        ],
        queryFn: () => getGraph(params).then((res) => res.data),
        staleTime: 30_000
    })
