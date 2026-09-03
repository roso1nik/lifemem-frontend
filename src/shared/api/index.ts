import axios from 'axios'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '../config'
import { getAcceptLanguage } from '../utils'

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

let refreshTokenAttempts = 0

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const status = error?.response?.status

        if (typeof window !== 'undefined') {
            if (status === 401 && !originalRequest?._retry) {
                if (refreshTokenAttempts >= 3) {
                    return Promise.reject(error)
                }

                originalRequest._retry = true
                refreshTokenAttempts += 1

                try {
                    const response = await axios.post(
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

                    const newAccessToken = response.data.accessToken

                    Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, newAccessToken)

                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                    refreshTokenAttempts = 0
                    return apiClient(originalRequest)
                } catch (refreshError) {
                    Cookies.remove(GLOBAL_DICTIONARY.ACCESS_TOKEN)
                    return Promise.reject(refreshError)
                }
            }
        }

        return Promise.reject(error)
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

export default apiClient
