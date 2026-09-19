'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Surface } from '@/shared/ui'
import { useInViewActive } from './use-in-view-active'
import { MemoryGraph, type GraphNodeId } from './memory-graph'
import { Reveal } from './reveal'
import { landingSectionClass, landingSectionInnerClass } from './landing-layout'

const LEGEND_KEYS = ['note', 'person', 'place'] as const

const DEMO_CYCLE_FULL: GraphNodeId[] = ['park', 'dasha', 'cafe', 'evening', 'max']
const DEMO_CYCLE_COMPACT: GraphNodeId[] = ['park', 'dasha', 'cafe', 'evening']
const CYCLE_MS = 2000

export const LandingGraph = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()
    const demoRef = useRef<HTMLDivElement>(null)
    const inView = useInViewActive(demoRef)
    const [compact, setCompact] = useState(false)
    const [activeId, setActiveId] = useState<GraphNodeId>('park')
    const cycle = compact ? DEMO_CYCLE_COMPACT : DEMO_CYCLE_FULL

    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)')
        const sync = () => setCompact(!media.matches)
        sync()
        media.addEventListener('change', sync)
        return () => media.removeEventListener('change', sync)
    }, [])

    useEffect(() => {
        setActiveId((current) => (cycle.includes(current) ? current : cycle[0]))
    }, [cycle])

    useEffect(() => {
        if (reduce || !inView) return

        const timer = window.setInterval(() => {
            setActiveId((current) => {
                const index = cycle.indexOf(current)
                return cycle[(index + 1) % cycle.length] ?? cycle[0]
            })
        }, CYCLE_MS)

        return () => window.clearInterval(timer)
    }, [cycle, inView, reduce])

    return (
        <section id="graph" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-10">
                    <Reveal className="max-w-xl lg:max-w-none">
                        <p className="text-primary text-sm font-medium tracking-tight">{t('graph.kicker')}</p>
                        <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl">
                            {t('graph.title')}
                        </h2>
                        <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t('graph.body')}</p>
                        <ul className="mt-6 space-y-3">
                            {LEGEND_KEYS.map((key) => (
                                <li key={key} className="flex gap-3 text-sm leading-snug">
                                    <span
                                        className={
                                            key === 'person'
                                                ? 'bg-muted border-sage mt-1 size-3 shrink-0 rounded-full border-2'
                                                : key === 'place'
                                                  ? 'bg-accent border-primary mt-1 size-3 shrink-0 rounded-full border-2'
                                                  : 'bg-accent border-primary mt-1 size-3.5 shrink-0 rounded-full border-2'
                                        }
                                        aria-hidden
                                    />
                                    <span>
                                        <span className="font-medium">{t(`graph.legend.${key}.title`)}</span>
                                        <span className="text-muted-foreground"> — {t(`graph.legend.${key}.body`)}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-muted-foreground mt-6 text-sm leading-relaxed">{t('graph.scenario')}</p>
                        <p className="text-muted-foreground/90 mt-2 text-xs leading-relaxed">{t('graph.demoHint')}</p>
                    </Reveal>

                    <Reveal className="min-w-0">
                        <Surface frost className="overflow-hidden px-1 py-4 sm:px-4 sm:py-8 md:px-6 md:py-10">
                            <div ref={demoRef} className="min-w-0">
                                <MemoryGraph
                                    compact={compact}
                                    activeId={activeId}
                                    nodeLabels={!compact}
                                    className={compact ? 'min-h-[140px] sm:min-h-[152px]' : 'min-h-[280px] lg:min-h-[340px]'}
                                />
                            </div>
                        </Surface>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
