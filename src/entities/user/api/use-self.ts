import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { Self } from '../model'

export const getSelf = async (): AxiosPromise<Self> => {
    const res = await apiClient.get('/user/me')
    return res
}

export const useSelf = () =>
    useQuery({
        queryKey: [ApiQueryKeys.GET_SELF],
        queryFn: () => getSelf().then((res) => res.data),
        staleTime: 60_000
    })
