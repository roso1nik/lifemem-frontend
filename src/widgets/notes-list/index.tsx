'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useSearchEntries } from '@/entities/entry/api/use-search-entries'
import { EntrySearchItem } from '@/entities/entry/model'
import { EntryCard } from '@/entities/entry/ui/entry-card'
import { Loader } from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'

export type EntriesDayGroup = {
    key: string
    label: string
    entries: EntrySearchItem[]
}

const groupEntriesByDay = (entries: EntrySearchItem[]): EntriesDayGroup[] => {
    const sorted = [...entries].sort(
        (a, b) => dayjsInstance(b.createdAt).valueOf() - dayjsInstance(a.createdAt).valueOf()
    )
    const map = new Map<string, EntrySearchItem[]>()

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
}

interface NotesListProps {
    onSelect?: (entry: EntrySearchItem) => void
    selectedId?: string | null
}

export const NotesList = ({ onSelect, selectedId }: NotesListProps) => {
    const t = useTranslations('home')
    const { data, isLoading, isError } = useSearchEntries()
    const entries = data?.data ?? []
    const groups = useMemo(() => groupEntriesByDay(entries), [entries])

    if (isLoading) {
        return <Loader variant="section" size="sm" />
    }

    if (isError) {
        return (
            <div className="min-h-0 flex-1 overflow-y-auto">
                <p className="text-muted-foreground p-4 text-sm">{t('notesError')}</p>
            </div>
        )
    }

    if (groups.length === 0) {
        return (
            <div className="min-h-0 flex-1 overflow-y-auto">
                <p className="text-muted-foreground p-4 text-sm">{t('noNotes')}</p>
            </div>
        )
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
            {groups.map((group, gi) => (
                <motion.section
                    key={group.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35, delay: gi * 0.04 }}
                >
                    <h3 className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">
                        {group.label}
                    </h3>
                    <ul className="flex flex-col gap-0.5">
                        {group.entries.map((entry) => (
                            <li key={entry.id}>
                                <EntryCard
                                    entry={entry}
                                    selected={selectedId === entry.id}
                                    onSelect={onSelect}
                                />
                            </li>
                        ))}
                    </ul>
                </motion.section>
            ))}
        </div>
    )
}
