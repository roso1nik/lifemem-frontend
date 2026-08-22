'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'

export const LandingPlaces = () => {
    const t = useTranslations('landing')

    return (
        <section id="places" className="scroll-mt-20 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <Reveal>
                    <div className="relative min-h-[52vh] overflow-hidden rounded-[var(--radius-card)] md:min-h-[58vh]">
                        <Image
                            src={LANDING_PHOTOS.park}
                            alt={t('stage.parkAlt')}
                            fill
                            sizes="(min-width: 1280px) 1200px, 100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_92%,transparent)] via-[color-mix(in_srgb,var(--background)_35%,transparent)] to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 max-w-xl px-5 py-6 md:px-8 md:py-10">
                            <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                                {t('places.title')}
                            </h2>
                            <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t('places.body')}</p>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
