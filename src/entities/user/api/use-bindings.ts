import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { OAuthBinding } from '../model'

export const getBindings = async (): AxiosPromise<OAuthBinding[]> => {
    const res = await apiClient.get('/user/me/bindings')
    return res
}

export const useBindings = () =>
    useQuery({
        queryKey: [ApiQueryKeys.USER_BINDINGS],
        queryFn: () => getBindings().then((res) => res.data)
    })
