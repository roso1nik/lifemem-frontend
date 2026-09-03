'use client'

import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiQueryKeys } from '@/shared/config'
import { dayjsInstance } from '@/shared/utils'
import { Entry } from '../model'

export const useEntries = () => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: [ApiQueryKeys.ENTRIES],
        queryFn: () => queryClient.getQueryData<Entry[]>([ApiQueryKeys.ENTRIES]) ?? [],
        staleTime: Infinity
    })
}

export const useTodayEntriesCount = () => {
    const { data: entries = [] } = useEntries()

    return useMemo(
        () => entries.filter((entry) => dayjsInstance(entry.createdAt).isSame(dayjsInstance(), 'day')).length,
        [entries]
    )
}

export type EntriesDayGroup = {
    key: string
    label: string
    entries: Entry[]
}

export const useEntriesGroupedByDay = (): EntriesDayGroup[] => {
    const { data: entries = [] } = useEntries()

    return useMemo(() => {
        const sorted = [...entries].sort(
            (a, b) => dayjsInstance(b.createdAt).valueOf() - dayjsInstance(a.createdAt).valueOf()
        )
        const map = new Map<string, Entry[]>()

        for (const entry of sorted) {
            const key = dayjsInstance(entry.createdAt).format('YYYY-MM-DD')
            const list = map.get(key) ?? []
            list.push(entry)
            map.set(key, list)
        }

        const today = dayjsInstance().format('YYYY-MM-DD')
        const yesterday = dayjsInstance().subtract(1, 'day').format('YYYY-MM-DD')

        return Array.from(map.entries()).map(([key, dayEntries]) => {
            let label = dayjsInstance(key).format('D MMMM YYYY')
            if (key === today) label = 'Сегодня'
            else if (key === yesterday) label = 'Вчера'
            return { key, label, entries: dayEntries }
        })
    }, [entries])
}

export const useEntryById = (entryId: string | null) => {
    const { data: entries = [] } = useEntries()

    return useMemo(() => entries.find((entry) => entry.id === entryId) ?? null, [entries, entryId])
}
