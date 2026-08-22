'use client'

import { useTranslations } from 'next-intl'
import { Surface } from '@/shared/ui'
import { MemoryGraph } from './memory-graph'
import { Reveal } from './reveal'

export const LandingGraph = () => {
    const t = useTranslations('landing')

    return (
        <section id="graph" className="scroll-mt-20 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <Reveal className="max-w-2xl">
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                        {t('graph.title')}
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-[46ch] text-base leading-relaxed">{t('graph.body')}</p>
                </Reveal>
                <Reveal className="mt-10">
                    <Surface frost className="overflow-hidden px-1 py-6 md:px-4 md:py-10">
                        <MemoryGraph className="min-h-[220px] md:min-h-[320px]" />
                    </Surface>
                </Reveal>
            </div>
        </section>
    )
}
