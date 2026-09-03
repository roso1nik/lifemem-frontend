import { AxiosPromise } from 'axios'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'
import { AlertBaseDto } from '@/shared/types'

export const appleUnlink = async (): AxiosPromise<AlertBaseDto> => {
    const res = await apiClient.delete('/auth/apple/unlink')
    return res
}

export const useAppleUnlink = () =>
    useMutation({
        mutationKey: [ApiQueryKeys.APPLE_UNLINK],
        mutationFn: () => appleUnlink(),
        onSuccess: (response) => toast.success(response.data.message || 'Apple отвязан'),
        onError: () => toast.error('Не удалось отвязать Apple')
    })
