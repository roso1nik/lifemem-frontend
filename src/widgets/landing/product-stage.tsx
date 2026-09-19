'use client'

import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Entry, getEntryPreviewText } from '@/entities/entry/model'
import { EntryCard } from '@/entities/entry/ui/entry-card'
import { Surface } from '@/shared/ui'
import { cn } from '@/shared/utils'
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
                cafe: t('notes.cafe')
            }),
        [t]
    )
    const [selectedId, setSelectedId] = useState<LandingNoteId>('park')
    const onSelect = useCallback((entry: Entry) => {
        setSelectedId(entry.id as LandingNoteId)
    }, [])
    const selected = notes.find((note) => note.id === selectedId) ?? notes[0]
    const photo = notePhoto(selected)
    const photoAlt =
        selected.id === 'evening'
            ? t('stage.eveningAlt')
            : selected.id === 'cafe'
              ? t('stage.cafeAlt')
              : t('stage.parkAlt')

    return (
        <Surface
            frost
            capsule
            className="overflow-hidden shadow-[0_20px_60px_-24px_color-mix(in_srgb,var(--primary)_38%,transparent)] sm:shadow-[0_24px_80px_-28px_color-mix(in_srgb,var(--primary)_35%,transparent)] max-md:!rounded-[var(--radius-card)]"
        >
            <div className="border-hairline flex items-baseline justify-between gap-3 border-b px-3 py-2.5 sm:px-4 sm:py-3">
                <p className="text-sm font-medium tracking-tight">{t('stage.today')}</p>
                <p className="text-sage text-xs font-medium">{t('stage.notesCount', { count: notes.length })}</p>
            </div>

            <div className="border-hairline flex gap-1.5 overflow-x-auto p-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {notes.map((note) => {
                    const active = note.id === selectedId
                    return (
                        <button
                            key={note.id}
                            type="button"
                            onClick={() => onSelect(note)}
                            className={cn(
                                'border-hairline shrink-0 rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors',
                                active
                                    ? 'bg-accent/70 text-foreground border-primary/35'
                                    : 'bg-card/80 text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {t(`nodes.${note.id}`)}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                <ul className="border-hairline divide-hairline hidden divide-y md:block md:border-r">
                    {notes.map((note) => (
                        <li
                            key={note.id}
                            className={note.id === selectedId ? 'bg-accent/40 motion-safe:animate-[pulse_2s_ease-in-out_1]' : undefined}
                        >
                            <EntryCard entry={note} selected={note.id === selectedId} onSelect={onSelect} />
                        </li>
                    ))}
                </ul>

                <div className="flex min-h-0 flex-col">
                    <div className="relative aspect-[2/1] max-h-[168px] overflow-hidden bg-muted sm:max-h-[200px] md:aspect-auto md:max-h-none md:min-h-[200px]">
                        {photo && (
                            <motion.div
                                key={selected.id}
                                className="absolute inset-0"
                                initial={reduce ? false : { opacity: 0.45, scale: 1.03 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Image
                                    src={photo}
                                    alt={photoAlt}
                                    fill
                                    sizes="(min-width: 768px) 320px, 90vw"
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-foreground line-clamp-2 px-3 pt-2.5 text-sm leading-snug sm:line-clamp-3 sm:px-4 sm:pt-3 md:line-clamp-4">
                        {getEntryPreviewText(selected)}
                    </p>
                    <div className="hidden px-2 pt-1 pb-2.5 sm:block">
                        <div className="border-hairline bg-muted/30 h-[72px] w-full overflow-hidden rounded-[var(--radius-card)] border px-1 py-1 sm:h-[88px] md:h-[96px]">
                            <MemoryGraph
                                compact
                                activeId={graphNodeForNote(selected.id)}
                                className="h-full w-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Surface>
    )
}
