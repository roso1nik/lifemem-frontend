'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Surface } from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'
import { getLandingNotes } from './mock'
import { Reveal } from './reveal'

export const LandingAi = () => {
    const t = useTranslations('landing')
    const source = useMemo(
        () =>
            getLandingNotes({
                park: t('notes.park'),
                evening: t('notes.evening'),
                kyoto: t('notes.kyoto')
            }).find((note) => note.id === 'park'),
        [t]
    )

    return (
        <section id="ai" className="scroll-mt-20 py-24 md:py-32">
            <div className="mx-auto max-w-4xl px-4 md:px-6">
                <Reveal>
                    <h2 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                        {t('ai.title')}
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-[46ch] text-base leading-relaxed">{t('ai.body')}</p>
                </Reveal>

                <Reveal className="mt-10">
                    <Surface frost className="px-5 py-6 md:px-8 md:py-8">
                        <p className="text-muted-foreground text-sm">{t('ai.query')}</p>
                        <blockquote className="text-foreground mt-4 text-xl leading-snug font-medium tracking-tight md:text-2xl">
                            {t('ai.answer')}
                        </blockquote>
                        {source && (
                            <footer className="border-hairline mt-8 border-t pt-4">
                                <p className="text-sage text-xs font-medium tracking-tight">{t('ai.fromNotes')}</p>
                                <p className="text-muted-foreground mt-2 text-sm leading-snug">{source.content}</p>
                                <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
                                    {dayjsInstance(source.createdAt).format('D MMMM, HH:mm')}
                                </p>
                            </footer>
                        )}
                    </Surface>
                </Reveal>
            </div>
        </section>
    )
}
