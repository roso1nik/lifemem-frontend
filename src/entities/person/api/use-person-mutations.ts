import z from 'zod'
import { AxiosError, AxiosPromise } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import apiClient from '@/shared/api'
import { getApiErrorMessage } from '@/shared/api/errors'
import { ApiQueryKeys } from '@/shared/config'
import { Person } from '../model'
import { listPersons } from './use-list-persons'

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

/** Create person, or return existing one on name conflict (409). */
export const createPersonOrGetExisting = async (name: string): Promise<Person> => {
    const trimmed = name.trim()
    try {
        const res = await createPerson({ name: trimmed })
        return res.data
    } catch (error) {
        const status = (error as AxiosError)?.response?.status
        if (status !== 409) throw error

        const listed = await listPersons({ query: trimmed, page: 1, count: 20 })
        const match = listed.data.data.find(
            (person) => person.name.trim().toLowerCase() === trimmed.toLowerCase()
        )
        if (match) return match
        throw error
    }
}

export const useCreatePerson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.PERSON_CREATE],
        mutationFn: async (data: CreatePersonRequest) => createPersonOrGetExisting(data.name),
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
