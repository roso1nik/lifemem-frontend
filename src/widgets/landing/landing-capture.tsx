'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Camera, MapPin } from 'lucide-react'
import { CaptureMobileShowcase } from './capture-mobile-showcase'
import { CaptureTextCard } from './capture-text-card'
import { CaptureVoiceCard } from './capture-voice-card'
import { CapturePhotoCarousel } from './capture-photo-carousel'
import { LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'
import { cn } from '@/shared/utils'
import {
    landingCardClass,
    landingCardHoverClass,
    landingKickerClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionLeadClass,
    landingSectionTitleClass
} from './landing-layout'

export const LandingCapture = () => {
    const t = useTranslations('landing')

    return (
        <section id="capture" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal>
                    <p className={landingKickerClass}>{t('capture.kicker')}</p>
                    <h2 className={cn(landingSectionTitleClass, 'max-w-xl')}>{t('capture.title')}</h2>
                    <p className={cn(landingSectionLeadClass, 'max-w-[46ch]')}>{t('capture.body')}</p>
                </Reveal>

                <Reveal className="mt-8 md:mt-10">
                    <CaptureMobileShowcase />
                    <div className="hidden grid-cols-1 gap-3 md:grid md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[minmax(200px,1fr)_auto]">
                        <article
                            className={cn(
                                landingCardClass,
                                landingCardHoverClass,
                                'group relative overflow-hidden lg:col-span-5 lg:row-span-2'
                            )}
                        >
                            <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[280px]">
                                <CapturePhotoCarousel alt={t('capture.photoAlt')} className="absolute inset-0 overflow-hidden" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--background)_90%,transparent)] to-transparent px-4 pt-14 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Camera size={16} className="text-primary" strokeWidth={1.7} />
                                        <p className="text-sm font-medium tracking-tight">{t('capture.photo')}</p>
                                    </div>
                                    <p className="text-muted-foreground mt-1 text-sm leading-snug">{t('capture.photoHint')}</p>
                                </div>
                            </div>
                        </article>

                        <CaptureVoiceCard />

                        <CaptureTextCard />

                        <article
                            className={cn(
                                'group relative overflow-hidden rounded-[var(--radius-card)] sm:col-span-2 lg:col-span-7',
                                'transition-all duration-200 hover:-translate-y-0.5'
                            )}
                        >
                            <div className="relative aspect-[16/10] w-full sm:aspect-[21/9] sm:min-h-[140px]">
                                <Image
                                    src={LANDING_PHOTOS.place}
                                    alt={t('capture.placeAlt')}
                                    fill
                                    sizes="(min-width: 1024px) 55vw, 100vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-16 sm:px-4 sm:pb-4">
                                    <div className={cn(landingCardClass, 'bg-card/90 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4')}>
                                        <div className="flex items-start gap-2">
                                            <MapPin size={16} className="text-sage mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-foreground text-sm font-medium tracking-tight">{t('capture.place')}</p>
                                                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{t('capture.placeHint')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}
