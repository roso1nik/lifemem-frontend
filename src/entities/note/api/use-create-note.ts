'use client'

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CreateNoteRequest } from '../model'
import { useNotesStore } from '../store/notes-store'
import { ApiQueryKeys } from '@/shared/config'

export const useCreateNote = () => {
    const addNote = useNotesStore((s) => s.addNote)

    return useMutation({
        mutationKey: [ApiQueryKeys.CREATE_NOTE],
        mutationFn: async (data: CreateNoteRequest) => {
            await new Promise((r) => setTimeout(r, 120))
            return addNote(data)
        },
        onError: () => toast.error('Не удалось сохранить заметку')
    })
}
