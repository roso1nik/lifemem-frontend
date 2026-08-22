'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'

export const LandingPlaces = () => {
    const t = useTranslations('landing')

    return (
        <section className="py-24 md:py-32">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <Reveal>
                    <figure>
                        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
                            <Image
                                src={LANDING_PHOTOS.park}
                                alt={t('stage.parkAlt')}
                                fill
                                sizes="(min-width: 1024px) 960px, 100vw"
                                className="object-cover"
                            />
                        </div>
                        <figcaption className="text-muted-foreground mt-3 text-sm">{t('places.caption')}</figcaption>
                    </figure>
                </Reveal>
                <Reveal className="mt-10 max-w-xl">
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">{t('places.title')}</h2>
                    <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t('places.body')}</p>
                </Reveal>
            </div>
        </section>
    )
}
