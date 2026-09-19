'use client'

import { Mic, Network, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import {
    landingKickerClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionLeadClass,
    landingSectionTitleClass
} from './landing-layout'
import { Reveal } from './reveal'
import { LandingContrast } from './landing-contrast'

const STEPS = [
    { key: 'capture' as const, Icon: Mic },
    { key: 'connect' as const, Icon: Network },
    { key: 'ask' as const, Icon: Sparkles }
] as const

export const LandingHow = () => {
    const t = useTranslations('landing')

    return (
        <section id="how" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className={landingKickerClass}>{t('how.kicker')}</p>
                    <h2 className={landingSectionTitleClass}>{t('how.title')}</h2>
                    <p className={cn(landingSectionLeadClass, 'mt-2 hidden sm:block')}>{t('how.body')}</p>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:hidden">{t('how.bodyShort')}</p>
                </Reveal>

                <div className="mt-8 grid grid-cols-3 gap-3 sm:hidden" role="list">
                    {STEPS.map(({ key, Icon }, index) => (
                        <article key={key} role="listitem" className="flex flex-col items-center text-center">
                            <div className="relative flex size-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,var(--card))] text-primary">
                                <Icon size={16} strokeWidth={1.75} />
                                <span className="bg-card text-muted-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[9px] font-semibold ring-1 ring-[var(--hairline)]">
                                    {index + 1}
                                </span>
                            </div>
                            <h3 className="mt-2 text-[11px] font-semibold leading-tight tracking-tight">
                                {t(`how.steps.${key}.title`)}
                            </h3>
                        </article>
                    ))}
                </div>

                <div className="mt-10 hidden gap-10 sm:grid sm:grid-cols-3 sm:gap-6 md:mt-12" role="list">
                    {STEPS.map(({ key, Icon }, index) => (
                        <Reveal key={key} delay={index * 0.05}>
                            <article role="listitem" className="relative mx-auto flex max-w-[16rem] flex-col items-center text-center sm:max-w-none">
                                {index < STEPS.length - 1 && (
                                    <span
                                        aria-hidden
                                        className="bg-hairline absolute top-5 left-[calc(50%+1.75rem)] hidden h-px w-[calc(100%-3.5rem)] sm:block"
                                    />
                                )}
                                <div className="relative flex size-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,var(--card))] text-primary ring-1 ring-[color-mix(in_srgb,var(--primary)_22%,transparent)]">
                                    <Icon size={17} strokeWidth={1.75} />
                                    <span className="bg-card text-muted-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-semibold tabular-nums ring-1 ring-[var(--hairline)]">
                                        {index + 1}
                                    </span>
                                </div>
                                <h3 className="mt-4 text-base font-semibold tracking-tight sm:text-[17px]">
                                    {t(`how.steps.${key}.title`)}
                                </h3>
                                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{t(`how.steps.${key}.body`)}</p>
                            </article>
                        </Reveal>
                    ))}
                </div>

                <LandingContrast />
            </div>
        </section>
    )
}
