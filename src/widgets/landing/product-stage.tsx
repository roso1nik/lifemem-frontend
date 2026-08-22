'use client'

import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import { Note } from '@/entities/note/model'
import { NoteCard } from '@/entities/note/ui/note-card'
import { Surface } from '@/shared/ui'
import { getLandingNotes, notePhoto, type LandingNoteId } from './mock'
import { graphNodeForNote, MemoryGraph } from './memory-graph'

export const ProductStage = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()
    const notes = useMemo(
        () =>
            getLandingNotes({
                park: t('notes.park'),
                evening: t('notes.evening'),
                kyoto: t('notes.kyoto')
            }),
        [t]
    )
    const [selectedId, setSelectedId] = useState<LandingNoteId>('park')
    const onSelect = useCallback((note: Note) => {
        setSelectedId(note.id as LandingNoteId)
    }, [])
    const selected = notes.find((note) => note.id === selectedId) ?? notes[0]
    const photo = notePhoto(selected)
    const photoAlt = selected.id === 'evening' ? t('stage.eveningAlt') : t('stage.parkAlt')

    return (
        <Surface
            frost
            capsule
            className="overflow-hidden shadow-[0_24px_80px_-28px_color-mix(in_srgb,var(--primary)_35%,transparent)]"
        >
            <div className="border-hairline flex items-baseline justify-between gap-3 border-b px-4 py-3">
                <p className="text-sm font-medium tracking-tight">{t('stage.today')}</p>
                <p className="text-sage text-xs font-medium">{t('stage.notesCount', { count: notes.length })}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <ul className="border-hairline divide-hairline divide-y sm:border-r">
                    {notes.map((note) => (
                        <li key={note.id}>
                            <NoteCard
                                note={note}
                                selected={note.id === selectedId}
                                onSelect={onSelect}
                            />
                        </li>
                    ))}
                </ul>
                <div className="flex min-h-[220px] flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {photo ? (
                            <motion.div
                                key={selected.id}
                                className="absolute inset-0"
                                initial={reduce ? false : { opacity: 0.4, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Image
                                    src={photo}
                                    alt={photoAlt}
                                    fill
                                    sizes="(min-width: 1024px) 320px, 90vw"
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        ) : (
                            <div className="text-sage flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                                <MapPin size={22} strokeWidth={1.6} />
                                <p className="text-sm font-medium tracking-tight">{t('nodes.kyoto')}</p>
                            </div>
                        )}
                    </div>
                    <p className="text-foreground line-clamp-3 px-4 pt-3 text-sm leading-snug">{selected.content}</p>
                    <div className="mt-auto px-2 pt-1 pb-2">
                        <MemoryGraph compact activeId={graphNodeForNote(selected.id)} className="max-h-28" />
                    </div>
                </div>
            </div>
        </Surface>
    )
}
