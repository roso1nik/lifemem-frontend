'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { NoteCard } from '@/entities/note/ui/note-card'
import { Surface } from '@/shared/ui'
import { getLandingNotes } from './mock'
import { Reveal } from './reveal'

export const LandingSearch = () => {
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

    return (
        <section id="search" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 md:px-6 md:py-32">
            <Reveal>
                <h2 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                    {t('search.title')}
                </h2>
                <p className="text-muted-foreground mt-3 max-w-[42ch] text-base leading-relaxed">{t('search.body')}</p>
            </Reveal>

            <Reveal className="mt-10 max-w-lg">
                <Surface frost className="overflow-hidden">
                    <div className="border-hairline flex items-center gap-2 border-b px-4 py-3">
                        <Search size={16} className="text-primary shrink-0" strokeWidth={1.7} />
                        <p className="text-foreground truncate text-sm font-medium tracking-tight">{t('search.query')}</p>
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
        </section>
    )
}
