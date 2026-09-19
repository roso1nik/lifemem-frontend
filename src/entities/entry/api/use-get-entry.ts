import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { EntryDetail } from '../model'

export const getEntry = async (id: string): AxiosPromise<EntryDetail> => {
    const res = await apiClient.get(`/entry/${id}`)
    return res
}

export const useGetEntry = (id: string | null | undefined) =>
    useQuery({
        queryKey: [ApiQueryKeys.ENTRY_BY_ID, id],
        queryFn: () => getEntry(id!).then((res) => res.data),
        enabled: Boolean(id)
    })
