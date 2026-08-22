'use client'

import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { CtaLink } from './cta-link'
import { ProductStage } from './product-stage'

export const LandingHero = () => {
    const t = useTranslations('landing')

    return (
        <section className="mx-auto grid min-h-0 w-full max-w-7xl grid-cols-1 items-start gap-10 px-4 pt-16 pb-16 md:px-6 lg:min-h-[100dvh] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:pt-20 lg:pb-20">
            <div className="max-w-xl">
                <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight md:text-5xl lg:text-6xl">
                    {t('hero.title')}
                </h1>
                <p className="text-muted-foreground mt-4 max-w-[36ch] text-base leading-relaxed md:text-lg">
                    {t('hero.sub')}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                    <CtaLink href={ROUTES.REGISTER} size="lg">
                        {t('getStarted')}
                    </CtaLink>
                    <CtaLink href={ROUTES.LOGIN} variant="subtle" size="lg">
                        {t('signIn')}
                    </CtaLink>
                </div>
            </div>
            <ProductStage />
        </section>
    )
}
