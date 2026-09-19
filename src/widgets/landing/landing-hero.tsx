'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Mic, Network, Search, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { CtaLink } from './cta-link'
import { ProductStage } from './product-stage'

const FEATURES = [
    { key: 'voice' as const, Icon: Mic },
    { key: 'graph' as const, Icon: Network },
    { key: 'search' as const, Icon: Search }
] as const

export const LandingHero = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()

    return (
        <section className="relative w-full">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 pt-6 pb-12 sm:gap-10 sm:pt-8 md:px-6 md:pb-16 lg:min-h-[calc(100dvh-5.5rem)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:pt-4 lg:pb-14">
                <motion.div
                    className="max-w-xl lg:max-w-none"
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
                >
                    <p className="text-primary inline-flex items-center gap-2 text-sm font-medium tracking-tight">
                        <Sparkles size={15} strokeWidth={1.75} className="opacity-90" />
                        {t('hero.eyebrow')}
                    </p>
                    <h1 className="mt-4 text-[1.85rem] leading-[1.06] font-semibold tracking-tight sm:text-4xl md:text-[2.65rem] lg:text-[3.25rem]">
                        {t('hero.titleLead')}{' '}
                        <span className="text-primary">{t('hero.titleAccent')}</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-[42ch] text-[15px] leading-relaxed sm:text-base md:text-lg">
                        {t('hero.sub')}
                    </p>
                    <p className="text-foreground/85 mt-3 text-sm font-medium tracking-tight">{t('hero.proof')}</p>

                    <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap sm:mt-8">
                        <CtaLink href={ROUTES.REGISTER} size="lg" className="w-full min-[420px]:w-auto">
                            {t('hero.ctaPrimary')}
                        </CtaLink>
                        <CtaLink href={`#how`} variant="subtle" size="lg" className="w-full min-[420px]:w-auto">
                            {t('hero.ctaSecondary')}
                        </CtaLink>
                    </div>

                    <ul className="mt-8 hidden flex-wrap gap-2 sm:mt-9 sm:flex">
                        {FEATURES.map(({ key, Icon }) => (
                            <li key={key}>
                                <span className="border-hairline bg-card/75 text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium sm:text-sm">
                                    <Icon size={14} className="text-primary shrink-0" strokeWidth={1.75} />
                                    {t(`hero.features.${key}`)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.5, delay: 0.06 }}
                    className="min-w-0 lg:justify-self-end"
                >
                    <ProductStage />
                </motion.div>
            </div>
        </section>
    )
}
