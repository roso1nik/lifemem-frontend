'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { Reveal } from './reveal'
import { landingCardClass } from './landing-layout'

const KEYS = ['folders', 'ai', 'search'] as const

export const LandingContrast = () => {
    const t = useTranslations('landing')

    return (
        <Reveal className="mt-10 md:mt-12">
            <p className="text-muted-foreground mb-4 text-center text-sm font-medium tracking-tight">{t('contrast.kicker')}</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                {KEYS.map((key) => (
                    <li
                        key={key}
                        className={cn(
                            landingCardClass,
                            'px-3 py-3 text-sm leading-snug sm:px-4 sm:py-4'
                        )}
                    >
                        <span className="text-muted-foreground/80 block text-[13px] line-through decoration-foreground/45 decoration-2 underline-offset-2 sm:text-sm">
                            {t(`contrast.items.${key}.before`)}
                        </span>
                        <span className="text-foreground mt-1 block font-medium">{t(`contrast.items.${key}.after`)}</span>
                    </li>
                ))}
            </ul>
        </Reveal>
    )
}
