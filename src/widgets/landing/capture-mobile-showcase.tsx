'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, MapPin, Mic, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { CapturePhotoCarousel } from './capture-photo-carousel'
import { CaptureVoiceCard } from './capture-voice-card'
import { CaptureTextCard } from './capture-text-card'
import { LANDING_PHOTOS } from './mock'
import { landingCardClass } from './landing-layout'

const MODES = ['photo', 'voice', 'text', 'place'] as const
type CaptureMode = (typeof MODES)[number]

const MODE_ICONS = {
    photo: Camera,
    voice: Mic,
    text: Type,
    place: MapPin
} as const

export const CaptureMobileShowcase = () => {
    const t = useTranslations('landing')
    const [mode, setMode] = useState<CaptureMode>('photo')

    return (
        <div className="md:hidden">
            <div className="flex gap-1.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {MODES.map((key) => {
                    const Icon = MODE_ICONS[key]
                    const active = mode === key
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setMode(key)}
                            className={cn(
                                'border-hairline flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                                active
                                    ? 'bg-accent/70 text-foreground border-primary/35'
                                    : 'text-muted-foreground bg-card/80'
                            )}
                        >
                            <Icon size={14} strokeWidth={1.75} />
                            {t(`capture.${key === 'place' ? 'place' : key}`)}
                        </button>
                    )
                })}
            </div>
            <div className="mt-2 min-h-[200px]">
                {mode === 'photo' && (
                    <article className={cn(landingCardClass, 'relative overflow-hidden')}>
                        <div className="relative aspect-[4/3] w-full">
                            <CapturePhotoCarousel alt={t('capture.photoAlt')} className="absolute inset-0 overflow-hidden" />
                        </div>
                    </article>
                )}
                {mode === 'voice' && <CaptureVoiceCard className="!col-span-1" />}
                {mode === 'text' && <CaptureTextCard className="!col-span-1" />}
                {mode === 'place' && (
                    <article className={cn(landingCardClass, 'relative overflow-hidden')}>
                        <div className="relative aspect-[16/10] w-full">
                            <Image src={LANDING_PHOTOS.place} alt={t('capture.placeAlt')} fill className="object-cover" sizes="100vw" />
                            <div className="absolute inset-x-0 bottom-0 p-3">
                                <p className="text-sm font-medium">{t('capture.place')}</p>
                                <p className="text-muted-foreground mt-1 text-xs leading-snug">{t('capture.placeHint')}</p>
                            </div>
                        </div>
                    </article>
                )}
            </div>
        </div>
    )
}
