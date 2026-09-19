'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { Reveal } from './reveal'
import {
    landingCardClass,
    landingKickerClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionTitleClass
} from './landing-layout'

const FAQ_KEYS = ['credits', 'cloud', 'export', 'languages', 'security'] as const

export const LandingFaq = () => {
    const t = useTranslations('landing')

    return (
        <section id="faq" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className={landingKickerClass}>{t('faq.kicker')}</p>
                    <h2 className={landingSectionTitleClass}>{t('faq.title')}</h2>
                </Reveal>
                <div className="mx-auto mt-8 max-w-2xl space-y-2">
                    {FAQ_KEYS.map((key, index) => (
                        <Reveal key={key} delay={index * 0.03}>
                            <details className={cn(landingCardClass, 'group p-0')}>
                                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold tracking-tight sm:px-5 sm:py-5 [&::-webkit-details-marker]:hidden">
                                    <span className="min-w-0 flex-1 pr-2">{t(`faq.items.${key}.q`)}</span>
                                    <ChevronDown
                                        size={18}
                                        className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180"
                                        strokeWidth={1.75}
                                        aria-hidden
                                    />
                                </summary>
                                <p className="text-muted-foreground border-hairline border-t px-4 pb-4 text-sm leading-relaxed sm:px-5 sm:pb-5">
                                    {t(`faq.items.${key}.a`)}
                                </p>
                            </details>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
