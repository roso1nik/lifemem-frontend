'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { APP_NAME } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { CtaLink } from './cta-link'
import { ProductStage } from './product-stage'

export const LandingHero = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()

    return (
        <section className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pt-14 pb-16 md:px-6 md:pt-16 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:pt-10 lg:pb-16">
            <motion.div
                className="max-w-xl"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
            >
                <p className="font-brand text-primary text-2xl font-semibold tracking-tight lowercase md:text-3xl">
                    {APP_NAME}
                </p>
                <h1 className="mt-3 text-4xl leading-[1.06] font-semibold tracking-tight md:text-5xl lg:text-[3.25rem]">
                    {t('hero.title')}
                </h1>
                <p className="text-muted-foreground mt-4 max-w-[38ch] text-base leading-relaxed md:text-lg">
                    {t('hero.sub')}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <CtaLink href={ROUTES.REGISTER} size="lg">
                        {t('getStarted')}
                    </CtaLink>
                    <CtaLink href={ROUTES.LOGIN} variant="subtle" size="lg">
                        {t('signIn')}
                    </CtaLink>
                </div>
            </motion.div>

            <motion.div
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: 0.06 }}
                className="min-w-0"
            >
                <ProductStage />
            </motion.div>
        </section>
    )
}
