'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { CtaLink } from './cta-link'
import { Reveal } from './reveal'
import { cn } from '@/shared/utils'
import {
    landingCardClass,
    landingKickerClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionLeadClass,
    landingSectionTitleClass
} from './landing-layout'

export const LandingClose = () => {
    const t = useTranslations('landing')

    return (
        <section className={landingSectionClass}>
            <Reveal className={landingSectionInnerClass}>
                <div
                    className={cn(
                        landingCardClass,
                        'relative overflow-hidden bg-[color-mix(in_srgb,var(--primary)_10%,var(--card))] px-6 py-8 text-center sm:px-10 sm:py-12 md:px-14 md:py-14'
                    )}
                >
                    <div className="relative mx-auto max-w-2xl">
                        <p className={landingKickerClass}>{t('cta.kicker')}</p>
                        <h2 className={landingSectionTitleClass}>{t('cta.title')}</h2>
                        <p className={cn(landingSectionLeadClass, 'mx-auto max-w-lg hidden sm:block')}>{t('cta.body')}</p>
                        <p className={cn(landingSectionLeadClass, 'mx-auto max-w-lg sm:hidden')}>{t('cta.bodyShort')}</p>
                        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
                            <CtaLink href={ROUTES.REGISTER} size="lg" className="w-full gap-1.5 sm:w-auto">
                                {t('cta.primary')}
                                <ArrowRight size={18} strokeWidth={2} />
                            </CtaLink>
                            <CtaLink href={ROUTES.LOGIN} variant="subtle" size="lg" className="hidden w-full sm:inline-flex sm:w-auto">
                                {t('signIn')}
                            </CtaLink>
                        </div>
                        <p className="text-muted-foreground mt-4 text-xs">{t('cta.note')}</p>
                    </div>
                </div>
            </Reveal>
        </section>
    )
}
