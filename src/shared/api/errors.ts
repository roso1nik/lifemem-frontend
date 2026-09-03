import { AxiosError } from 'axios'
import { ErrorResponseDto } from '@/shared/types'

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
    if (!error || typeof error !== 'object') return fallback

    const axiosError = error as AxiosError<ErrorResponseDto>
    const message = axiosError.response?.data?.errors?.[0]?.message

    return typeof message === 'string' && message.length > 0 ? message : fallback
}
