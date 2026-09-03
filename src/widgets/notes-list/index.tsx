'use client'

import { useEntriesGroupedByDay } from '@/entities/entry/api/use-entries'
import { Entry, getEntryPreviewText } from '@/entities/entry/model'
import { EntryCard } from '@/entities/entry/ui/entry-card'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface NotesListProps {
    onSelect?: (entry: Entry) => void
    selectedId?: string | null
}

export const NotesList = ({ onSelect, selectedId }: NotesListProps) => {
    const groups = useEntriesGroupedByDay()
    const t = useTranslations('home')

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

export { getEntryPreviewText }
