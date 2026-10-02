'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Pause, Play, Square, Trash2, Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/shared/ui'
import { cn } from '@/shared/utils'
import {
    formatVoiceDuration,
    type VoicePreview,
    type VoiceRecorderStatus
} from './use-voice-recorder'

type VoiceRecorderPanelProps = {
    status: VoiceRecorderStatus
    levels: number[]
    elapsedMs: number
    preview: VoicePreview | null
    onStop: () => void
    onCancel: () => void
    onDiscard: () => void
    onUse: (preview: VoicePreview) => void
    className?: string
}

export const VoiceRecorderPanel = ({
    status,
    levels,
    elapsedMs,
    preview,
    onStop,
    onCancel,
    onDiscard,
    onUse,
    className
}: VoiceRecorderPanelProps) => {
    const t = useTranslations('home.voiceRecorder')
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        setPlaying(false)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }, [preview?.url])

    useEffect(() => {
        return () => {
            audioRef.current?.pause()
        }
    }, [])

    const isRecording = status === 'recording' || status === 'requesting'
    const isPreview = status === 'preview' && preview

    const togglePlay = async () => {
        const el = audioRef.current
        if (!el || !preview) return
        if (playing) {
            el.pause()
            setPlaying(false)
            return
        }
        try {
            await el.play()
            setPlaying(true)
        } catch {
            setPlaying(false)
        }
    }

    return (
        <AnimatePresence mode="wait">
            {(isRecording || isPreview) && (
                <motion.div
                    key={isRecording ? 'recording' : 'preview'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                    className={cn('relative flex flex-col overflow-hidden px-4 py-5 sm:px-6 sm:py-7', className)}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: isRecording
                                ? `
                                    radial-gradient(ellipse 90% 80% at 50% -20%, color-mix(in srgb, var(--primary) 26%, transparent), transparent 58%),
                                    radial-gradient(ellipse 45% 35% at 100% 100%, color-mix(in srgb, #ef4444 8%, transparent), transparent 50%)
                                `
                                : `
                                    radial-gradient(ellipse 80% 70% at 18% 0%, color-mix(in srgb, var(--sage) 20%, transparent), transparent 55%),
                                    radial-gradient(ellipse 55% 45% at 92% 100%, color-mix(in srgb, var(--primary) 10%, transparent), transparent 50%)
                                `
                        }}
                    />

                    <div className="relative flex flex-col items-center text-center">
                        {isRecording ? (
                            <span className="bg-red-500 text-white mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase">
                                <span className="size-2 animate-pulse rounded-full bg-white" />
                                {t('recBadge')}
                            </span>
                        ) : (
                            <span className="bg-sage/18 text-sage mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide">
                                <Mic size={12} strokeWidth={2} />
                                {t('preview')}
                            </span>
                        )}

                        <p className="font-mono text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                            {formatVoiceDuration(isPreview ? preview.durationMs : elapsedMs)}
                        </p>
                        <p className="text-muted-foreground mt-2 max-w-[18rem] text-[13px] leading-relaxed sm:text-sm">
                            {isRecording ? t('recordingHint') : t('previewHint')}
                        </p>
                    </div>

                    <div
                        className={cn(
                            'border-hairline relative mx-auto mt-5 flex h-[4.5rem] w-full max-w-sm items-end justify-center gap-1 rounded-2xl px-3 py-3 sm:h-20',
                            'bg-[color-mix(in_srgb,var(--card)_60%,transparent)] backdrop-blur-sm'
                        )}
                        aria-hidden
                    >
                        {levels.map((level, index) => (
                            <span
                                key={index}
                                className={cn(
                                    'w-1 rounded-full transition-[height,opacity] duration-75 ease-out sm:w-1.5',
                                    isRecording ? 'bg-primary' : 'bg-sage'
                                )}
                                style={{
                                    height: `${Math.max(10, Math.round(level * 100))}%`,
                                    opacity: 0.4 + level * 0.6
                                }}
                            />
                        ))}
                    </div>

                    {isPreview && preview && (
                        <audio
                            ref={audioRef}
                            src={preview.url}
                            preload="metadata"
                            className="hidden"
                            onEnded={() => setPlaying(false)}
                        />
                    )}

                    <div className="relative mt-auto flex flex-col items-stretch gap-2 pt-6">
                        {isRecording ? (
                            <>
                                <Button
                                    type="button"
                                    size="md"
                                    fullWidth
                                    onClick={onStop}
                                    leftSection={<Square size={14} fill="currentColor" />}
                                    className="active:scale-[0.98] h-12! rounded-2xl!"
                                >
                                    {t('stop')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="subtle"
                                    size="sm"
                                    fullWidth
                                    onClick={onCancel}
                                    className="active:scale-[0.98]"
                                >
                                    {t('cancel')}
                                </Button>
                            </>
                        ) : preview ? (
                            <>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="subtle"
                                        size="md"
                                        onClick={() => void togglePlay()}
                                        leftSection={playing ? <Pause size={16} /> : <Play size={16} />}
                                        className="active:scale-[0.98] flex-1 rounded-2xl!"
                                    >
                                        {playing ? t('pause') : t('play')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="md"
                                        onClick={onDiscard}
                                        leftSection={<Trash2 size={16} />}
                                        className="active:scale-[0.98] rounded-2xl!"
                                        aria-label={t('discard')}
                                    >
                                        {t('discardShort')}
                                    </Button>
                                </div>
                                <Button
                                    type="button"
                                    size="md"
                                    fullWidth
                                    onClick={() => onUse(preview)}
                                    leftSection={<Check size={16} />}
                                    className="active:scale-[0.98] h-12! rounded-2xl!"
                                >
                                    {t('use')}
                                </Button>
                            </>
                        ) : null}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
