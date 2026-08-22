'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MapPin, Mic, Type } from 'lucide-react'
import { LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'

export const LandingCapture = () => {
    const t = useTranslations('landing')

    return (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
            <Reveal>
                <h2 className="max-w-xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                    {t('capture.title')}
                </h2>
                <p className="text-muted-foreground mt-3 max-w-[42ch] text-base leading-relaxed">{t('capture.body')}</p>
            </Reveal>

            <Reveal className="mt-10">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[minmax(220px,1fr)_minmax(180px,auto)]">
                    <article className="border-hairline bg-card/70 relative overflow-hidden rounded-[var(--radius-card)] border sm:col-span-2 lg:col-span-5 lg:row-span-2">
                        <div className="relative aspect-[4/3] h-full min-h-[240px] lg:aspect-auto">
                            <Image
                                src={LANDING_PHOTOS.evening}
                                alt={t('stage.eveningAlt')}
                                fill
                                sizes="(min-width: 1024px) 40vw, 100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_88%,transparent)] to-transparent px-4 pt-16 pb-4">
                                <p className="text-sm font-medium tracking-tight">{t('capture.photo')}</p>
                            </div>
                        </div>
                    </article>

                    <article className="border-hairline bg-muted/80 flex flex-col justify-between rounded-[var(--radius-card)] border p-5 lg:col-span-4">
                        <Mic size={18} className="text-primary" strokeWidth={1.7} />
                        <div className="mt-8">
                            <p className="text-sm font-medium tracking-tight">{t('capture.voice')}</p>
                            <p className="text-muted-foreground mt-1 text-sm leading-snug">{t('capture.voiceHint')}</p>
                        </div>
                    </article>

                    <article className="border-hairline bg-card/70 flex flex-col justify-between rounded-[var(--radius-card)] border p-5 lg:col-span-3">
                        <Type size={18} className="text-sage" strokeWidth={1.7} />
                        <div className="mt-8">
                            <p className="text-sm font-medium tracking-tight">{t('capture.text')}</p>
                            <p className="text-muted-foreground mt-1 text-sm leading-snug">{t('capture.textHint')}</p>
                        </div>
                    </article>

                    <article className="relative overflow-hidden rounded-[var(--radius-card)] sm:col-span-2 lg:col-span-7">
                        <div className="relative aspect-[21/9] min-h-[160px]">
                            <Image
                                src={LANDING_PHOTOS.park}
                                alt={t('stage.parkAlt')}
                                fill
                                sizes="(min-width: 1024px) 55vw, 100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_85%,transparent)] to-transparent px-4 pt-12 pb-3">
                                <MapPin size={12} className="text-sage" />
                                <p className="text-sm font-medium tracking-tight">{t('capture.place')}</p>
                                <p className="text-muted-foreground ml-1 hidden text-sm sm:inline">{t('capture.placeHint')}</p>
                            </div>
                        </div>
                    </article>
                </div>
            </Reveal>
        </section>
    )
}
