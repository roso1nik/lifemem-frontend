'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Mic, Pause, Play } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import classes from './voice-player.module.css'

export type VoicePlayerProps = {
    src: string
    className?: string
    label?: string
}

const formatTime = (seconds: number): string => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
    const total = Math.floor(seconds)
    const min = Math.floor(total / 60)
    const sec = total % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

const readDuration = (el: HTMLAudioElement): number => {
    const d = el.duration
    if (Number.isFinite(d) && d > 0) return d
    return 0
}

const safeSetCurrentTime = (el: HTMLAudioElement, time: number) => {
    if (!Number.isFinite(time) || time < 0) return
    try {
        el.currentTime = time
    } catch {
        // Media may not be seekable yet.
    }
}

/** Some streams report Infinity until a seek forces the browser to resolve length. */
const resolveDuration = (el: HTMLAudioElement): Promise<number> =>
    new Promise((resolve) => {
        const known = readDuration(el)
        if (known > 0) {
            resolve(known)
            return
        }

        let settled = false
        const finish = () => {
            if (settled) return
            settled = true
            el.removeEventListener('durationchange', onMeta)
            el.removeEventListener('loadedmetadata', onMeta)
            el.removeEventListener('loadeddata', onMeta)
            el.removeEventListener('timeupdate', onProbeTick)
            window.clearTimeout(timeoutId)
            resolve(readDuration(el))
        }

        const onMeta = () => {
            if (readDuration(el) > 0) finish()
        }

        const prev = Number.isFinite(el.currentTime) ? el.currentTime : 0

        const onProbeTick = () => {
            if (!(readDuration(el) > 0) && !Number.isFinite(el.duration)) return
            el.removeEventListener('timeupdate', onProbeTick)
            safeSetCurrentTime(el, prev)
            finish()
        }

        el.addEventListener('durationchange', onMeta)
        el.addEventListener('loadedmetadata', onMeta)
        el.addEventListener('loadeddata', onMeta)
        el.addEventListener('timeupdate', onProbeTick)

        // Force metadata probe for WebM / streaming URLs.
        safeSetCurrentTime(el, 1e101)

        const timeoutId = window.setTimeout(finish, 1200)
    })

export const VoicePlayer = ({ src, className, label }: VoicePlayerProps) => {
    const t = useTranslations('home.note')
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const [playing, setPlaying] = useState(false)
    const [current, setCurrent] = useState(0)
    const [duration, setDuration] = useState(0)
    const [dragging, setDragging] = useState(false)

    useEffect(() => {
        setPlaying(false)
        setCurrent(0)
        setDuration(0)
        const el = audioRef.current
        if (!el) return
        el.pause()
        safeSetCurrentTime(el, 0)
        void resolveDuration(el).then((d) => {
            if (d > 0) setDuration(d)
        })
    }, [src])

    useEffect(() => {
        return () => {
            audioRef.current?.pause()
        }
    }, [])

    const progress = duration > 0 ? Math.min(1, Math.max(0, current / duration)) : 0

    const togglePlay = async () => {
        const el = audioRef.current
        if (!el) return
        if (playing) {
            el.pause()
            setPlaying(false)
            return
        }
        if (!(duration > 0)) {
            const d = await resolveDuration(el)
            if (d > 0) setDuration(d)
        }
        try {
            await el.play()
            setPlaying(true)
        } catch {
            setPlaying(false)
        }
    }

    const seekFromClientX = (clientX: number) => {
        const el = audioRef.current
        const track = trackRef.current
        if (!el || !track || !(duration > 0)) return
        const rect = track.getBoundingClientRect()
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
        const next = ratio * duration
        if (!Number.isFinite(next)) return
        safeSetCurrentTime(el, next)
        setCurrent(next)
    }

    const onTrackPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!(duration > 0)) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        seekFromClientX(e.clientX)
    }

    const onTrackPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging) return
        seekFromClientX(e.clientX)
    }

    const onTrackPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging) return
        setDragging(false)
        try {
            e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
            // ignore
        }
    }

    return (
        <div className={cn(classes.root, className)}>
            <div aria-hidden className={classes.glow} />
            <audio
                ref={audioRef}
                src={src}
                preload="auto"
                className="hidden"
                onLoadedMetadata={(e) => {
                    const d = readDuration(e.currentTarget)
                    if (d > 0) setDuration(d)
                    else void resolveDuration(e.currentTarget).then((resolved) => {
                        if (resolved > 0) setDuration(resolved)
                    })
                }}
                onDurationChange={(e) => {
                    const d = readDuration(e.currentTarget)
                    if (d > 0) setDuration(d)
                }}
                onTimeUpdate={(e) => {
                    const time = e.currentTarget.currentTime
                    if (!dragging && Number.isFinite(time)) setCurrent(time)
                }}
                onEnded={() => {
                    setPlaying(false)
                    setCurrent(0)
                }}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
            />

            <div className={classes.row}>
                <button
                    type="button"
                    className={classes.play}
                    aria-label={playing ? t('voicePause') : t('voicePlay')}
                    onClick={() => void togglePlay()}
                >
                    {playing ? (
                        <Pause size={16} fill="currentColor" strokeWidth={0} />
                    ) : (
                        <Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                    )}
                </button>

                <div className={classes.meta}>
                    <div className={classes.labelRow}>
                        <span className={classes.badge}>
                            <Mic size={11} strokeWidth={2} />
                            {label ?? t('voice')}
                        </span>
                        <span className={classes.time}>
                            {formatTime(current)}
                            <span className={classes.timeSep}>/</span>
                            {formatTime(duration)}
                        </span>
                    </div>

                    <div
                        ref={trackRef}
                        className={classes.track}
                        role="slider"
                        tabIndex={0}
                        aria-label={t('voiceSeek')}
                        aria-valuemin={0}
                        aria-valuemax={Math.round(duration)}
                        aria-valuenow={Math.round(current)}
                        onPointerDown={onTrackPointerDown}
                        onPointerMove={onTrackPointerMove}
                        onPointerUp={onTrackPointerUp}
                        onPointerCancel={onTrackPointerUp}
                        onKeyDown={(e) => {
                            if (!(duration > 0) || !audioRef.current) return
                            const step = Math.max(1, duration * 0.05)
                            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                                e.preventDefault()
                                const next = Math.min(duration, current + step)
                                safeSetCurrentTime(audioRef.current, next)
                                setCurrent(next)
                            }
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                                e.preventDefault()
                                const next = Math.max(0, current - step)
                                safeSetCurrentTime(audioRef.current, next)
                                setCurrent(next)
                            }
                        }}
                    >
                        <div className={classes.trackBg} aria-hidden />
                        <div
                            className={classes.trackFill}
                            style={{ width: `${progress * 100}%` }}
                            aria-hidden
                        />
                        <div className={classes.bars} aria-hidden>
                            {Array.from({ length: 28 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={cn(classes.bar, playing && classes.barActive)}
                                    style={{
                                        height: `${30 + ((i * 41) % 55)}%`,
                                        animationDelay: `${(i % 8) * 0.08}s`,
                                        opacity: i / 28 < progress ? 0.95 : 0.28
                                    }}
                                />
                            ))}
                        </div>
                        <span
                            className={classes.thumb}
                            style={{ left: `${progress * 100}%` }}
                            aria-hidden
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

VoicePlayer.displayName = 'VoicePlayer'
