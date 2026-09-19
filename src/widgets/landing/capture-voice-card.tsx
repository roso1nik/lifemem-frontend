'use client'

import { Mic } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { landingCardClass, landingCardHoverClass } from './landing-layout'

const BARS = [0.35, 0.72, 0.48, 0.9, 0.55, 0.78, 0.42, 0.65, 0.88, 0.5, 0.7, 0.38]

type CaptureVoiceCardProps = {
    className?: string
}

export const CaptureVoiceCard = ({ className }: CaptureVoiceCardProps) => {
    const t = useTranslations('landing')

    return (
        <article
            className={cn(
                landingCardClass,
                landingCardHoverClass,
                'group relative flex min-h-[160px] flex-col overflow-hidden p-5 lg:col-span-4',
                className
            )}
        >
            <div
                aria-hidden
                className="absolute inset-0 bg-[color-mix(in_srgb,var(--primary)_12%,var(--card))]"
            />
            <div aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,var(--foreground)_1px,transparent_0)] [background-size:12px_12px]" />
            <div className="relative flex items-center justify-between">
                <Mic size={18} className="text-primary" strokeWidth={1.7} />
                <span className="bg-destructive/90 text-destructive-foreground flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                    <span className="size-1.5 animate-pulse rounded-full bg-current" />
                    Rec
                </span>
            </div>
            <div className="relative mt-6 flex h-14 items-end justify-center gap-[3px]" aria-hidden>
                {BARS.map((h, i) => (
                    <span
                        key={i}
                        className="bg-primary/70 w-[3px] rounded-full motion-safe:animate-[voice-bar_1.1s_ease-in-out_infinite]"
                        style={{
                            height: `${Math.round(h * 100)}%`,
                            animationDelay: `${i * 0.07}s`
                        }}
                    />
                ))}
            </div>
            <div className="relative mt-auto pt-4">
                <p className="text-sm font-medium tracking-tight">{t('capture.voice')}</p>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{t('capture.voiceHint')}</p>
            </div>
        </article>
    )
}
