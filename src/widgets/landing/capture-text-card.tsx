'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/shared/utils'
import { landingCardClass, landingCardHoverClass } from './landing-layout'
import { useInViewActive } from './use-in-view-active'

type CaptureTextCardProps = {
    className?: string
}

type Phase = 'typing' | 'pausing' | 'deleting'

export const CaptureTextCard = ({ className }: CaptureTextCardProps) => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()
    const rootRef = useRef<HTMLElement>(null)
    const active = useInViewActive(rootRef)
    const samples = useMemo(() => t.raw('capture.textSamples') as string[], [t])
    const [sampleIndex, setSampleIndex] = useState(0)
    const [text, setText] = useState('')
    const [phase, setPhase] = useState<Phase>('typing')

    useEffect(() => {
        if (!active || reduce || samples.length === 0) {
            if (reduce || samples.length === 0) {
                setText(samples[0] ?? '')
            }
            return
        }

        const full = samples[sampleIndex] ?? ''
        let timeout: number

        if (phase === 'typing') {
            if (text.length < full.length) {
                timeout = window.setTimeout(() => setText(full.slice(0, text.length + 1)), 55)
            } else {
                timeout = window.setTimeout(() => setPhase('pausing'), 900)
            }
        } else if (phase === 'pausing') {
            timeout = window.setTimeout(() => setPhase('deleting'), 400)
        } else if (text.length > 0) {
            timeout = window.setTimeout(() => setText(full.slice(0, text.length - 1)), 35)
        } else {
            setPhase('typing')
            setSampleIndex((value) => (value + 1) % samples.length)
        }

        return () => window.clearTimeout(timeout)
    }, [active, phase, reduce, sampleIndex, samples, text])

    return (
        <article
            ref={rootRef}
            className={cn(landingCardClass, landingCardHoverClass, 'group flex flex-col p-5 lg:col-span-3', className)}
        >
            <Type size={18} className="text-sage" strokeWidth={1.7} />
            <div className="border-hairline bg-muted/50 mt-4 min-h-[44px] rounded-xl border px-3 py-2.5">
                <p className="text-foreground min-h-[20px] text-sm leading-snug">
                    {text}
                    {!reduce && active && (
                        <span className="bg-primary ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" aria-hidden />
                    )}
                </p>
            </div>
            <div className="mt-auto pt-4">
                <p className="text-sm font-medium tracking-tight">{t('capture.text')}</p>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{t('capture.textHint')}</p>
            </div>
        </article>
    )
}
