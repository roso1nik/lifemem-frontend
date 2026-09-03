import { AxiosPromise } from 'axios'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { HealthServiceStatusDto } from '../model'

export const healthCheck = async (): AxiosPromise<HealthServiceStatusDto[]> => {
    const res = await apiClient.get('/health')
    return res
}

export const useHealthCheck = () =>
    useQuery({
        queryKey: [ApiQueryKeys.HEALTH],
        queryFn: () => healthCheck().then((res) => res.data)
    })
