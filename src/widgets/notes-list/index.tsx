'use client'

import { useNotesGroupedByDay } from '@/entities/note/api/use-notes'
import { Note } from '@/entities/note/model'
import { NoteCard } from '@/entities/note/ui/note-card'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface NotesListProps {
    onSelect?: (note: Note) => void
    selectedId?: string | null
}

export const NotesList = ({ onSelect, selectedId }: NotesListProps) => {
    const groups = useNotesGroupedByDay()
    const t = useTranslations('home')

    if (groups.length === 0) {
        return <p className="text-muted-foreground p-4 text-sm">{t('noNotes')}</p>
    }

    return (
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
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
                        {group.notes.map((note) => (
                            <li key={note.id}>
                                <NoteCard
                                    note={note}
                                    selected={selectedId === note.id}
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
