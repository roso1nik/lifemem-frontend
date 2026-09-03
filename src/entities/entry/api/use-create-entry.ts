'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ApiQueryKeys } from '@/shared/config'
import { createEntry, CreateEntryRequest, CreateEntryResponse } from './create-entry-request'
import { Entry } from '../model'

const toEntryStub = (response: CreateEntryResponse, data: CreateEntryRequest): Entry => {
    const now = new Date().toISOString()

    return {
        id: response.id,
        createdAt: now,
        updatedAt: now,
        title: data.title ?? '',
        text: data.text ?? null,
        isHasVoice: Boolean(data.voice),
        images: response.images,
        isReady: response.places.processing === 0,
        peoples: [],
        places: []
    }
}

export const useCreateEntry = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: [ApiQueryKeys.CREATE_ENTRY],
        mutationFn: (data: CreateEntryRequest) => createEntry(data),
        onSuccess: (response, variables) => {
            queryClient.setQueryData<Entry[]>([ApiQueryKeys.ENTRIES], (prev = []) => [
                toEntryStub(response.data, variables),
                ...prev
            ])
        },
        onError: () => toast.error('Не удалось сохранить заметку')
    })
}
