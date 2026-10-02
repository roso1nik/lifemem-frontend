'use client'

import { useTranslations } from 'next-intl'
import { Reveal } from './reveal'
import { landingCardClass } from './landing-layout'
import { cn } from '@/shared/utils'

const USE_KEYS = ['voice', 'files', 'entities', 'processing'] as const

export const LandingCreditsNote = () => {
    const t = useTranslations('landing')

    return (
        <Reveal className="mx-auto mt-8 max-w-2xl">
            <div className={cn(landingCardClass, 'p-4 sm:p-5')}>
                <p className="text-sm font-semibold tracking-tight">{t('credits.title')}</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{t('credits.body')}</p>
                <ul className="text-muted-foreground mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed">
                    {USE_KEYS.map((key) => (
                        <li key={key}>{t(`credits.uses.${key}`)}</li>
                    ))}
                </ul>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{t('credits.exampleFree')}</p>
                <p className="text-muted-foreground/80 mt-3 text-xs leading-relaxed">{t('credits.disclaimer')}</p>
            </div>
        </Reveal>
    )
}
