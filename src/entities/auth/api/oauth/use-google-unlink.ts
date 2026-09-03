import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const googleUnlink = async (): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete('/auth/google/unlink')
    return res
}

export const useGoogleUnlink = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.GOOGLE_UNLINK],
        mutationFn: () => googleUnlink(),
        onSuccess: (response) => toast.success(response.data.message || 'Google отвязан'),
        onError: () => toast.error('Не удалось отвязать Google')
    })
