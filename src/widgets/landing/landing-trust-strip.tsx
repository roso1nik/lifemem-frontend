'use client'

import { Download, Shield, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { Reveal } from './reveal'
import { landingCardClass, landingSectionClass, landingSectionInnerClass, landingSectionTitleClass } from './landing-layout'

const ITEMS = [
    { key: 'transport' as const, Icon: Shield },
    { key: 'models' as const, Icon: Sparkles },
    { key: 'leave' as const, Icon: Download }
] as const

export const LandingTrustStrip = () => {
    const t = useTranslations('landing')

    return (
        <section id="trust" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal>
                    <h2 className={cn(landingSectionTitleClass, 'text-center text-xl sm:text-2xl md:text-3xl')}>
                        {t('trust.title')}
                    </h2>
                    <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                        {ITEMS.map(({ key, Icon }) => (
                            <li key={key} className={cn(landingCardClass, 'flex gap-3 p-4 sm:flex-col sm:items-center sm:text-center sm:p-5')}>
                                <Icon size={20} className="text-primary shrink-0" strokeWidth={1.75} />
                                <div>
                                    <p className="text-sm font-semibold tracking-tight">{t(`trust.${key}Title`)}</p>
                                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                                        {t(`trust.${key}Body`)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="text-muted-foreground mt-5 text-center text-sm">
                        <a href="#privacy" className="text-primary font-medium no-underline hover:underline">
                            {t('trust.moreLink')}
                        </a>
                    </p>
                </Reveal>
            </div>
        </section>
    )
}
