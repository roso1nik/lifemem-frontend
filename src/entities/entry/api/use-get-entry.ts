import { AxiosPromise } from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { EntryDetail, entryNeedsProcessingPoll } from '../model'

export const getEntry = async (id: string): AxiosPromise<EntryDetail> => {
    const res = await apiClient.get(`/entry/${id}`)
    return res
}

export const useGetEntry = (id: string | null | undefined) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: [ApiQueryKeys.ENTRY_BY_ID, id],
        queryFn: () => getEntry(id!).then((res) => res.data),
        enabled: Boolean(id),
        refetchInterval: (q) => {
            const entry = q.state.data
            if (!entry) return false
            return entryNeedsProcessingPoll(entry) ? 2500 : false
        },
        refetchIntervalInBackground: true
    })

    useEffect(() => {
        if (!query.data?.isReady) return
        queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
    }, [query.data?.isReady, query.data?.id, queryClient])

    return query
}
