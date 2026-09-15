import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { ApiQueryKeys } from '@/shared/config'

export const deleteEntry = async (id: string): AxiosPromise<void> => {
    const res = await apiClient.delete(`/entry/${id}`)
    return res
}

export const useDeleteEntry = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.DELETE_ENTRY],
        mutationFn: (id: string) => deleteEntry(id),
        onSuccess: (_response, id) => {
            queryClient.removeQueries({ queryKey: [ApiQueryKeys.ENTRY_BY_ID, id] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            toast.success('Заметка удалена')
        },
        onError: () => toast.error('Не удалось удалить заметку')
    })
}
