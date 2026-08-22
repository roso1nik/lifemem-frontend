'use client'

import { useTranslations } from 'next-intl'
import { Surface } from '@/shared/ui'
import { MemoryGraph } from './memory-graph'
import { Reveal } from './reveal'

export const LandingGraph = () => {
    const t = useTranslations('landing')

    return (
        <section id="graph" className="scroll-mt-20 bg-[color-mix(in_srgb,var(--muted)_55%,transparent)] py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <Reveal>
                    <h2 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                        {t('graph.title')}
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-[46ch] text-base leading-relaxed">{t('graph.body')}</p>
                </Reveal>
                <Reveal className="mt-10">
                    <Surface frost className="px-2 py-6 md:px-6 md:py-10">
                        <MemoryGraph />
                    </Surface>
                </Reveal>
            </div>
        </section>
    )
}
