import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '../config'
import { getAcceptLanguage } from '../utils'

const AUTH_SKIP_REFRESH_PATHS = ['/auth/login', '/auth/refresh', '/auth/logout', '/auth/confirm-phone'] as const

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

const shouldSkipRefresh = (url?: string) => {
    if (!url) return false
    return AUTH_SKIP_REFRESH_PATHS.some((path) => url.includes(path))
}

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true
})

apiClient.interceptors.request.use(
    (config) => {
        config.headers['x-client-type'] = 'web'
        config.headers['x-accept-language'] = getAcceptLanguage()

        if (typeof window !== 'undefined') {
            const accessToken = Cookies.get(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
        }
        return config
    },
    (error) => Promise.reject(error)
)

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
    const response = await axios.post<{ accessToken?: string }>(
        '/auth/refresh',
        {},
        {
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
            withCredentials: true,
            headers: {
                'x-client-type': 'web',
                'x-accept-language': getAcceptLanguage()
            }
        }
    )

    const newAccessToken = response.data?.accessToken
    if (typeof newAccessToken === 'string' && newAccessToken.length > 0) {
        Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, newAccessToken)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
        return newAccessToken
    }

    return null
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined

        if (typeof window === 'undefined' || !originalRequest) {
            return Promise.reject(error)
        }

        const status = error.response?.status

        if (status !== 401 || originalRequest._retry || shouldSkipRefresh(originalRequest.url)) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null
                })
            }

            const newAccessToken = await refreshPromise

            if (newAccessToken) {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            }

            return apiClient(originalRequest)
        } catch (refreshError) {
            Cookies.remove(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            delete apiClient.defaults.headers.common['Authorization']
            return Promise.reject(refreshError)
        }
    }
)

export const apiServerClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: false
})
apiServerClient.interceptors.request.use((config) => {
    config.headers['x-client-type'] = 'web'
    config.headers['x-accept-language'] = 'ru'
    if (config.headers?.cookie) {
        delete config.headers.cookie
    }
    return config
})

export { getApiErrorMessage } from './errors'

export default apiClient
