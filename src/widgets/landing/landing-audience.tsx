'use client'

import { Heart, MapPin, NotebookPen } from 'lucide-react'
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

const CARDS = [
    { key: 'diary' as const, Icon: NotebookPen },
    { key: 'people' as const, Icon: Heart },
    { key: 'trips' as const, Icon: MapPin }
] as const

export const LandingAudience = () => {
    const t = useTranslations('landing')

    return (
        <section className={cn(landingSectionClass, 'py-12 md:py-16')}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className={landingKickerClass}>{t('audience.kicker')}</p>
                    <h2 className={landingSectionTitleClass}>{t('audience.title')}</h2>
                </Reveal>
                <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                    {CARDS.map(({ key, Icon }, index) => (
                        <Reveal key={key} delay={index * 0.04}>
                            <li className={cn(landingCardClass, 'h-full p-4 sm:p-5')}>
                                <Icon size={20} className="text-primary" strokeWidth={1.75} />
                                <p className="mt-3 text-sm font-semibold tracking-tight">{t(`audience.cards.${key}.title`)}</p>
                                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                                    {t(`audience.cards.${key}.body`)}
                                </p>
                            </li>
                        </Reveal>
                    ))}
                </ul>
            </div>
        </section>
    )
}
