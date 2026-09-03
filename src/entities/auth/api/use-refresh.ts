import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import apiClient from '@/shared/api'
import { ApiQueryKeys, GLOBAL_DICTIONARY } from '@/shared/config'

export interface AccessToken {
    accessToken: string
}

export const optionalRefreshTokenSchema = z.object({
    refreshToken: z.string().optional()
})

export type OptionalRefreshTokenRequest = z.infer<typeof optionalRefreshTokenSchema>

export const refresh = async (data?: OptionalRefreshTokenRequest): AxiosPromise<AccessToken> => {
    const res = await apiClient.post('/auth/refresh', data ?? {})
    return res
}

export const useRefresh = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.REFRESH],
        mutationFn: (data?: OptionalRefreshTokenRequest) => refresh(data),
        onSuccess: (response) => {
            Cookies.set(GLOBAL_DICTIONARY.ACCESS_TOKEN, response.data.accessToken)
        }
    })
