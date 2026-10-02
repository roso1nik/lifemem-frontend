'use client'

import { useTranslations } from 'next-intl'
import { Reveal } from './reveal'
import {
    landingKickerClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionTitleClass
} from './landing-layout'

const STEPS = ['account', 'firstNote', 'discover'] as const

export const LandingAfterSignup = () => {
    const t = useTranslations('landing')

    return (
        <section id="after-signup" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className={landingKickerClass}>{t('afterSignup.kicker')}</p>
                    <h2 className={landingSectionTitleClass}>{t('afterSignup.title')}</h2>
                </Reveal>
                <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                    {STEPS.map((key, index) => (
                        <Reveal key={key} delay={index * 0.05}>
                            <li className="text-center">
                                <span className="bg-accent text-primary inline-flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
                                    {index + 1}
                                </span>
                                <p className="mt-3 text-sm font-semibold tracking-tight">{t(`afterSignup.steps.${key}.title`)}</p>
                                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                                    {t(`afterSignup.steps.${key}.body`)}
                                </p>
                            </li>
                        </Reveal>
                    ))}
                </ol>
            </div>
        </section>
    )
}
