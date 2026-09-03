import axios, { AxiosPromise } from 'axios'
import Cookies from 'js-cookie'
import { useQuery } from '@tanstack/react-query'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'
import { getAcceptLanguage } from '@/shared/utils'
import { HealthServiceStatusDto } from '../model'

/** OpenAPI `/health` lives at API origin root, not under `/api/v1`. */
const getHealthUrl = () => {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL ?? '').replace(/\/$/, '')
    const origin = base.replace(/\/api\/v1$/i, '')
    return `${origin}/health`
}

export const healthCheck = async (): AxiosPromise<HealthServiceStatusDto[]> => {
    const headers: Record<string, string> = {
        'x-client-type': 'web',
        'x-accept-language': getAcceptLanguage()
    }

    if (typeof window !== 'undefined') {
        const accessToken = Cookies.get(GLOBAL_DICTIONARY.ACCESS_TOKEN)
        if (accessToken) headers.Authorization = `Bearer ${accessToken}`
    }

    return axios.get(getHealthUrl(), { headers, withCredentials: true })
}

export const useHealthCheck = () =>
    useQuery({
        queryKey: [ApiQueryKeys.HEALTH],
        queryFn: () => healthCheck().then((res) => res.data)
    })
