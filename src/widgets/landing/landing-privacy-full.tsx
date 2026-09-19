'use client'

import Image from 'next/image'
import { Download, Lock, Shield, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'
import {
    landingCardClass,
    landingCardHoverClass,
    landingIconWellClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionLeadClass,
    landingSectionTitleClass
} from './landing-layout'

const PRIVACY_ITEMS = [
    { key: 'transport' as const, Icon: Shield },
    { key: 'models' as const, Icon: Sparkles },
    { key: 'leave' as const, Icon: Download }
] as const

export const LandingPrivacyFull = () => {
    const t = useTranslations('landing')

    return (
        <section id="privacy" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
                    <Reveal className="flex flex-col gap-6">
                        <div className={cn(landingCardClass, 'p-6 sm:p-8')}>
                            <div className="bg-accent/80 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
                                <Lock size={14} strokeWidth={1.75} />
                                {t('privacy.kicker')}
                            </div>
                            <h2 className={cn(landingSectionTitleClass, 'mt-4')}>{t('privacy.title')}</h2>
                            <p className={landingSectionLeadClass}>{t('privacy.body')}</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {PRIVACY_ITEMS.map(({ key, Icon }) => (
                                <article
                                    key={key}
                                    className={cn(landingCardClass, landingCardHoverClass, 'flex gap-4 p-5 md:p-6')}
                                >
                                    <div className={landingIconWellClass}>
                                        <Icon size={18} strokeWidth={1.75} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold tracking-tight md:text-lg">
                                            {t(`privacy.${key}Title`)}
                                        </h3>
                                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-[15px]">
                                            {t(`privacy.${key}Body`)}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal className="relative min-h-[240px] overflow-hidden rounded-[var(--radius-card)] lg:min-h-0 lg:self-stretch">
                        <Image
                            src={LANDING_PHOTOS.privacy}
                            alt={t('privacy.imageAlt')}
                            fill
                            sizes="(min-width: 1024px) 420px, 100vw"
                            className="object-cover"
                        />
                        <div className="border-hairline/80 pointer-events-none absolute inset-0 border-l-0 bg-[color-mix(in_srgb,var(--background)_18%,transparent)] lg:border-l" />
                    </Reveal>
                </div>
            </div>
        </section>
    )
}
