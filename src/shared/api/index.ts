import axios from 'axios'
import Cookies from 'js-cookie'
import { GLOBAL_DICTIONARY } from '../config'

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true
})

// Добавление токена в запрос
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const accessToken = Cookies.get(GLOBAL_DICTIONARY.ACCESS_TOKEN)
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`
            }
            return config
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Обработка ответов
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
                    const response = await axios.post('auth/refresh', {}, {
                        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
                        withCredentials: true
                    })

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
    if (config.headers?.cookie) {
        delete config.headers.cookie
    }
    return config
})

export default apiClient
