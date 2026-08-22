'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Sparkles } from 'lucide-react'
import { NoteCard } from '@/entities/note/ui/note-card'
import { Surface } from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'
import { getLandingNotes } from './mock'
import { Reveal } from './reveal'

export const LandingAsk = () => {
    const t = useTranslations('landing')
    const notes = useMemo(
        () =>
            getLandingNotes({
                park: t('notes.park'),
                evening: t('notes.evening'),
                kyoto: t('notes.kyoto')
            }),
        [t]
    )
    const results = notes.filter((note) => note.id === 'park' || note.id === 'kyoto')
    const source = notes.find((note) => note.id === 'park')

    return (
        <section id="ask" className="scroll-mt-20 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <Reveal>
                    <h2 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                        {t('ask.title')}
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-[46ch] text-base leading-relaxed">{t('ask.body')}</p>
                </Reveal>

                <div className="mt-10 grid grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-6">
                    <Reveal>
                        <Surface frost className="overflow-hidden">
                            <div className="border-hairline flex items-center gap-2.5 border-b px-4 py-3.5">
                                <Search size={16} className="text-primary shrink-0" strokeWidth={1.7} />
                                <p className="text-foreground min-w-0 truncate text-sm font-medium tracking-tight">
                                    {t('ask.query')}
                                </p>
                                <span className="bg-accent text-primary ml-auto flex size-7 shrink-0 items-center justify-center rounded-full">
                                    <Sparkles size={12} />
                                </span>
                            </div>
                            <ul className="divide-hairline divide-y">
                                {results.map((note) => (
                                    <li key={note.id}>
                                        <NoteCard note={note} />
                                    </li>
                                ))}
                            </ul>
                        </Surface>
                    </Reveal>

                    <Reveal>
                        <Surface frost className="px-5 py-6 md:px-7 md:py-7">
                            <p className="text-muted-foreground text-sm leading-snug">{t('ask.prompt')}</p>
                            <blockquote className="text-foreground mt-4 text-lg leading-snug font-medium tracking-tight md:text-xl">
                                {t('ask.answer')}
                            </blockquote>
                            {source && (
                                <footer className="border-hairline mt-7 border-t pt-4">
                                    <p className="text-sage text-xs font-medium tracking-tight">{t('ask.fromNotes')}</p>
                                    <p className="text-muted-foreground mt-2 text-sm leading-snug">{source.content}</p>
                                    <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
                                        {dayjsInstance(source.createdAt).format('D MMMM, HH:mm')}
                                    </p>
                                </footer>
                            )}
                        </Surface>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
