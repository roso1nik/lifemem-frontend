'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { CalendarRange, MapPinned, NotebookPen } from 'lucide-react'
import { Reveal } from './reveal'
import {
    landingCardClass,
    landingSectionClass,
    landingSectionInnerClass
} from './landing-layout'
import { cn } from '@/shared/utils'

const PINS = [
    { id: 'park', x: '26%', y: '40%', labelKey: 'places.pins.park' as const, detailKey: 'places.pinDetails.park' as const },
    { id: 'cafe', x: '58%', y: '34%', labelKey: 'places.pins.cafe' as const, detailKey: 'places.pinDetails.cafe' as const },
    { id: 'office', x: '74%', y: '52%', labelKey: 'places.pins.office' as const, detailKey: 'places.pinDetails.office' as const },
    { id: 'river', x: '16%', y: '56%', labelKey: 'places.pins.river' as const, detailKey: 'places.pinDetails.river' as const },
    { id: 'home', x: '46%', y: '72%', labelKey: 'places.pins.home' as const, detailKey: 'places.pinDetails.home' as const }
] as const

const STAT_KEYS = ['notes', 'cities', 'routes'] as const
const HIGHLIGHT_KEYS = ['timeline', 'clusters', 'search'] as const

export const LandingPlaces = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()

    return (
        <section id="places" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mb-8 max-w-2xl">
                    <p className="text-primary text-sm font-medium tracking-tight">{t('places.kicker')}</p>
                    <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl">
                        {t('places.title')}
                    </h2>
                    <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t('places.body')}</p>
                </Reveal>

                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-8">
                    <Reveal className="flex min-h-0 lg:min-h-[520px]">
                        <div className="relative min-h-[320px] w-full flex-1 overflow-hidden rounded-[var(--radius-card)] md:min-h-[400px] lg:min-h-full">
                            <div
                                aria-hidden
                                className="absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--primary)_18%,var(--background)),color-mix(in_srgb,var(--sage)_14%,var(--background)))]"
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(var(--hairline)_1px,transparent_1px),linear-gradient(90deg,var(--hairline)_1px,transparent_1px)] [background-size:28px_28px]"
                            />
                            <svg
                                aria-hidden
                                className="text-primary/25 absolute inset-0 h-full w-full"
                                viewBox="0 0 800 400"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 280 Q120 220 220 260 T420 240 T620 200 T800 260"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M80 120 Q200 80 320 140 T520 100 T720 160"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    opacity="0.7"
                                />
                            </svg>

                            {PINS.map((pin, index) => (
                                <motion.div
                                    key={pin.id}
                                    className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: pin.x, top: pin.y }}
                                    initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ type: 'spring', bounce: 0.35, duration: 0.45, delay: index * 0.06 }}
                                >
                                    <span className="bg-primary shadow-[0_0_0_6px_color-mix(in_srgb,var(--primary)_25%,transparent)] relative flex size-3.5 rounded-full ring-2 ring-[var(--background)]" />
                                    <span className="bg-card/98 border-hairline pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-max max-w-[min(240px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border px-3 py-2 text-left shadow-md sm:block sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                                        <span className="text-foreground block text-xs font-semibold tracking-tight">
                                            {t(pin.labelKey)}
                                        </span>
                                        <span className="text-muted-foreground mt-0.5 block text-[11px] leading-snug whitespace-nowrap">
                                            {t(pin.detailKey)}
                                        </span>
                                    </span>
                                </motion.div>
                            ))}

                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
                                <div className="bg-accent/90 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                                    <MapPinned size={13} strokeWidth={1.75} />
                                    {t('places.mapLabel')}
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal className="flex min-h-0 flex-col justify-center gap-4 lg:min-h-[520px]">
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            {STAT_KEYS.map((key) => (
                                <div
                                    key={key}
                                    className={cn(landingCardClass, 'px-3 py-3 text-center sm:px-4 sm:py-4')}
                                >
                                    <p className="text-primary text-lg font-semibold tabular-nums sm:text-xl">
                                        {t(`places.stats.${key}.value`)}
                                    </p>
                                    <p className="text-muted-foreground mt-1 text-[11px] leading-snug sm:text-xs">
                                        {t(`places.stats.${key}.label`)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <ul className={cn(landingCardClass, 'divide-hairline max-h-[220px] divide-y overflow-y-auto sm:max-h-none')}>
                            {PINS.map((pin) => (
                                <li key={pin.id} className="px-4 py-3 sm:px-5">
                                    <p className="text-sm font-medium tracking-tight">{t(pin.labelKey)}</p>
                                    <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed">{t(pin.detailKey)}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="border-hairline bg-muted/40 rounded-[var(--radius-card)] border p-4 sm:p-5">
                            <p className="text-sm font-medium tracking-tight">{t('places.highlightsTitle')}</p>
                            <ul className="mt-3 space-y-2.5">
                                {HIGHLIGHT_KEYS.map((key) => (
                                    <li key={key} className="text-muted-foreground flex gap-2.5 text-sm leading-snug">
                                        {key === 'timeline' && <CalendarRange size={16} className="text-primary mt-0.5 shrink-0" />}
                                        {key === 'clusters' && <MapPinned size={16} className="text-primary mt-0.5 shrink-0" />}
                                        {key === 'search' && <NotebookPen size={16} className="text-primary mt-0.5 shrink-0" />}
                                        {t(`places.highlights.${key}`)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
