import z from 'zod'
import { AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { Person } from '../model'

export const createPersonSchema = z.object({
    name: z.string().min(1).max(200)
})

export type CreatePersonRequest = z.infer<typeof createPersonSchema>

export const createPerson = async (data: CreatePersonRequest): AxiosPromise<Person> => {
    const res = await apiClient.post('/person', data)
    return res
}

export const deletePerson = async (id: string): AxiosPromise<void> => {
    const res = await apiClient.delete(`/person/${id}`)
    return res
}

export const useCreatePerson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.PERSON_CREATE],
        mutationFn: (data: CreatePersonRequest) => createPerson(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PERSON_LIST] })
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось создать человека'))
    })
}

export const useDeletePerson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.PERSON_DELETE],
        mutationFn: (id: string) => deletePerson(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.PERSON_LIST] })
            queryClient.invalidateQueries({ queryKey: [ApiQueryKeys.ENTRY_SEARCH] })
            toast.success('Человек удалён')
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Не удалось удалить человека'))
    })
}
