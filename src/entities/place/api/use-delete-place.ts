import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'

export const deletePlace = async (id: string): AxiosPromise<void> => {
    const res = await apiClient.delete(`/place/${id}`)
    return res
}

export const useDeletePlace = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.PLACE_DELETE],
        mutationFn: (id: string) => deletePlace(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PLACE_LIST] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            toast.success('Место удалено')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось удалить место'))
    })
}
