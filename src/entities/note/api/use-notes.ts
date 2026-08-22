'use client'

import { useMemo } from 'react'
import { useNotesStore } from '../store/notes-store'
import { Note } from '../model'
import { dayjsInstance } from '@/shared/utils'

export const useNotes = () => {
    const notes = useNotesStore((s) => s.notes)
    return { data: notes, isLoading: false }
}

export const useTodayNotesCount = () => {
    const notes = useNotesStore((s) => s.notes)
    return useMemo(
        () => notes.filter((n) => dayjsInstance(n.createdAt).isSame(dayjsInstance(), 'day')).length,
        [notes]
    )
}

export type NotesDayGroup = {
    key: string
    label: string
    notes: Note[]
}

export const useNotesGroupedByDay = (): NotesDayGroup[] => {
    const notes = useNotesStore((s) => s.notes)

    return useMemo(() => {
        const sorted = [...notes].sort(
            (a, b) => dayjsInstance(b.createdAt).valueOf() - dayjsInstance(a.createdAt).valueOf()
        )
        const map = new Map<string, Note[]>()

        for (const note of sorted) {
            const key = dayjsInstance(note.createdAt).format('YYYY-MM-DD')
            const list = map.get(key) ?? []
            list.push(note)
            map.set(key, list)
        }

        const today = dayjsInstance().format('YYYY-MM-DD')
        const yesterday = dayjsInstance().subtract(1, 'day').format('YYYY-MM-DD')

        return Array.from(map.entries()).map(([key, dayNotes]) => {
            let label = dayjsInstance(key).format('D MMMM YYYY')
            if (key === today) label = 'Сегодня'
            else if (key === yesterday) label = 'Вчера'
            return { key, label, notes: dayNotes }
        })
    }, [notes])
}
