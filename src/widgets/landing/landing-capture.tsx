'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MapPin, Mic, Type } from 'lucide-react'
import { LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'

export const LandingCapture = () => {
    const t = useTranslations('landing')

    return (
        <section className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32">
            <Reveal>
                <h2 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                    {t('capture.title')}
                </h2>
                <p className="text-muted-foreground mt-3 max-w-[42ch] text-base leading-relaxed">{t('capture.body')}</p>
            </Reveal>

            <Reveal className="mt-10">
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-12 md:overflow-visible md:pb-0">
                    <article className="bg-muted border-hairline w-[78vw] shrink-0 snap-start rounded-[var(--radius-card)] border p-5 md:col-span-3 md:w-auto">
                        <Mic size={18} className="text-primary" strokeWidth={1.7} />
                        <p className="mt-4 text-sm font-medium tracking-tight">{t('capture.voice')}</p>
                        <p className="text-muted-foreground mt-1 text-sm leading-snug">{t('capture.voiceHint')}</p>
                    </article>
                    <article className="w-[82vw] shrink-0 snap-start md:col-span-4 md:w-auto">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] md:h-full md:min-h-[220px] md:aspect-auto">
                            <Image
                                src={LANDING_PHOTOS.evening}
                                alt={t('stage.eveningAlt')}
                                fill
                                sizes="(min-width: 768px) 33vw, 82vw"
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-2 text-sm font-medium tracking-tight">{t('capture.photo')}</p>
                    </article>
                    <article className="w-[72vw] shrink-0 snap-start md:col-span-3 md:w-auto">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] md:h-full md:min-h-[220px] md:aspect-auto">
                            <Image
                                src={LANDING_PHOTOS.park}
                                alt={t('stage.parkAlt')}
                                fill
                                sizes="(min-width: 768px) 25vw, 72vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <MapPin size={12} className="text-sage" />
                            <p className="text-sm font-medium tracking-tight">{t('capture.place')}</p>
                        </div>
                        <p className="text-muted-foreground mt-1 hidden text-sm leading-snug md:block">
                            {t('capture.placeHint')}
                        </p>
                    </article>
                    <article className="border-hairline bg-card w-[70vw] shrink-0 snap-start rounded-[var(--radius-card)] border p-5 md:col-span-2 md:flex md:w-auto md:flex-col md:justify-between">
                        <Type size={18} className="text-sage" strokeWidth={1.7} />
                        <div className="mt-4 md:mt-0">
                            <p className="text-sm font-medium tracking-tight">{t('capture.text')}</p>
                            <p className="text-muted-foreground mt-1 text-sm leading-snug">{t('capture.textHint')}</p>
                        </div>
                    </article>
                </div>
            </Reveal>
        </section>
    )
}
