'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type VoiceRecorderStatus = 'idle' | 'requesting' | 'recording' | 'preview' | 'error'

export type VoicePreview = {
    file: File
    url: string
    durationMs: number
}

type UseVoiceRecorderOptions = {
    maxDurationMs?: number
    barCount?: number
    onFallbackPick?: () => void
    onMaxDuration?: () => void
}

const DEFAULT_MAX_MS = 15 * 60 * 1000
const TIMESLICE_MS = 250

const pickMimeType = (): string | undefined => {
    if (typeof MediaRecorder === 'undefined') return undefined
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus'
    if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm'
    if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4'
    return undefined
}

const extensionForMime = (mime: string): string => {
    if (mime.includes('mp4') || mime.includes('m4a') || mime.includes('aac')) return 'm4a'
    if (mime.includes('ogg')) return 'ogg'
    return 'webm'
}

const supportsLiveRecording = () =>
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)

export const formatVoiceDuration = (ms: number): string => {
    const totalSec = Math.max(0, Math.floor(ms / 1000))
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export const useVoiceRecorder = (options: UseVoiceRecorderOptions = {}) => {
    const maxDurationMs = options.maxDurationMs ?? DEFAULT_MAX_MS
    const barCount = options.barCount ?? 24
    const onFallbackPickRef = useRef(options.onFallbackPick)
    const onMaxDurationRef = useRef(options.onMaxDuration)
    onFallbackPickRef.current = options.onFallbackPick
    onMaxDurationRef.current = options.onMaxDuration

    const [status, setStatus] = useState<VoiceRecorderStatus>('idle')
    const [elapsedMs, setElapsedMs] = useState(0)
    const [levels, setLevels] = useState<number[]>(() => Array.from({ length: barCount }, () => 0.12))
    const [preview, setPreview] = useState<VoicePreview | null>(null)
    const [error, setError] = useState<string | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const rafRef = useRef<number | null>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const startedAtRef = useRef<number>(0)
    const mimeRef = useRef<string>('audio/webm')
    const reduceMotionRef = useRef(false)
    const maxHitRef = useRef(false)
    const discardRequestedRef = useRef(false)

    const stopTracks = useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
    }, [])

    const stopAnalyser = useCallback(() => {
        if (rafRef.current != null) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
        void audioContextRef.current?.close().catch(() => undefined)
        audioContextRef.current = null
        analyserRef.current = null
    }, [])

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const revokePreview = useCallback(() => {
        setPreview((current) => {
            if (current?.url) URL.revokeObjectURL(current.url)
            return null
        })
    }, [])

    const resetMeter = useCallback(() => {
        setLevels(Array.from({ length: barCount }, () => 0.12))
    }, [barCount])

    const cleanupRecording = useCallback(() => {
        clearTimer()
        stopAnalyser()
        stopTracks()
        mediaRecorderRef.current = null
        chunksRef.current = []
    }, [clearTimer, stopAnalyser, stopTracks])

    const discard = useCallback(() => {
        discardRequestedRef.current = true
        if (mediaRecorderRef.current?.state === 'recording' || mediaRecorderRef.current?.state === 'paused') {
            try {
                mediaRecorderRef.current.stop()
            } catch {
                // ignore
            }
        }
        cleanupRecording()
        revokePreview()
        setElapsedMs(0)
        setError(null)
        setStatus('idle')
        resetMeter()
        maxHitRef.current = false
    }, [cleanupRecording, resetMeter, revokePreview])

    const tickLevels = useCallback(() => {
        const analyser = analyserRef.current
        if (!analyser) return

        const data = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(data)

        const next: number[] = []
        const step = Math.max(1, Math.floor(data.length / barCount))
        for (let i = 0; i < barCount; i++) {
            let sum = 0
            const start = i * step
            for (let j = 0; j < step && start + j < data.length; j++) {
                sum += data[start + j] ?? 0
            }
            const avg = sum / step / 255
            next.push(Math.min(1, 0.08 + avg * 1.35))
        }
        setLevels(next)
        rafRef.current = requestAnimationFrame(tickLevels)
    }, [barCount])

    const finalizeFromChunks = useCallback(() => {
        // Always strip codecs — backend `@IsMimeType()` rejects `audio/webm;codecs=opus`
        const rawMime = mimeRef.current || 'audio/webm'
        const mime = rawMime.split(';', 1)[0]?.trim().toLowerCase() || 'audio/webm'
        const audioMime = mime.startsWith('audio/') ? mime : 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: audioMime })
        const durationMs = Math.min(Date.now() - startedAtRef.current, maxDurationMs)
        const ext = extensionForMime(audioMime)
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: audioMime })
        const url = URL.createObjectURL(file)

        stopAnalyser()
        stopTracks()
        clearTimer()
        mediaRecorderRef.current = null
        chunksRef.current = []

        setElapsedMs(durationMs)
        setPreview({ file, url, durationMs })
        setStatus('preview')
        resetMeter()
    }, [clearTimer, maxDurationMs, resetMeter, stopAnalyser, stopTracks])

    const stop = useCallback(() => {
        const recorder = mediaRecorderRef.current
        if (!recorder || (recorder.state !== 'recording' && recorder.state !== 'paused')) {
            return
        }
        try {
            recorder.stop()
        } catch {
            cleanupRecording()
            setStatus('idle')
        }
    }, [cleanupRecording])

    const start = useCallback(async (): Promise<{ ok: true } | { ok: false; error: string }> => {
        if (status === 'recording' || status === 'requesting') return { ok: false, error: 'busy' }

        if (!supportsLiveRecording()) {
            onFallbackPickRef.current?.()
            return { ok: false, error: 'unsupported' }
        }

        revokePreview()
        setError(null)
        setElapsedMs(0)
        maxHitRef.current = false
        discardRequestedRef.current = false
        setStatus('requesting')

        reduceMotionRef.current =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            })
            streamRef.current = stream

            const mimeType = pickMimeType()
            mimeRef.current = mimeType?.split(';')[0] ?? 'audio/webm'
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
            chunksRef.current = []

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data)
            }

            recorder.onerror = () => {
                cleanupRecording()
                setError('recorder_error')
                setStatus('error')
            }

            recorder.onstop = () => {
                if (discardRequestedRef.current) {
                    discardRequestedRef.current = false
                    chunksRef.current = []
                    cleanupRecording()
                    setStatus('idle')
                    return
                }
                if (chunksRef.current.length === 0) {
                    cleanupRecording()
                    setStatus('idle')
                    return
                }
                finalizeFromChunks()
            }

            mediaRecorderRef.current = recorder
            startedAtRef.current = Date.now()
            recorder.start(TIMESLICE_MS)
            setStatus('recording')

            try {
                const AudioCtx =
                    window.AudioContext ||
                    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
                if (AudioCtx) {
                    const ctx = new AudioCtx()
                    audioContextRef.current = ctx
                    const source = ctx.createMediaStreamSource(stream)
                    const analyser = ctx.createAnalyser()
                    analyser.fftSize = 256
                    analyser.smoothingTimeConstant = 0.72
                    source.connect(analyser)
                    analyserRef.current = analyser
                    if (!reduceMotionRef.current) {
                        rafRef.current = requestAnimationFrame(tickLevels)
                    } else {
                        setLevels(Array.from({ length: barCount }, (_, i) => 0.2 + (i % 3) * 0.12))
                    }
                }
            } catch {
                // analyser is optional
            }

            timerRef.current = setInterval(() => {
                const elapsed = Date.now() - startedAtRef.current
                setElapsedMs(Math.min(elapsed, maxDurationMs))
                if (elapsed >= maxDurationMs && !maxHitRef.current) {
                    maxHitRef.current = true
                    onMaxDurationRef.current?.()
                    try {
                        mediaRecorderRef.current?.stop()
                    } catch {
                        // ignore
                    }
                }
            }, 200)

            return { ok: true }
        } catch {
            cleanupRecording()
            setError('permission_denied')
            setStatus('idle')
            onFallbackPickRef.current?.()
            return { ok: false, error: 'permission_denied' }
        }
    }, [barCount, cleanupRecording, finalizeFromChunks, maxDurationMs, revokePreview, status, tickLevels])

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current?.state === 'recording') {
                try {
                    mediaRecorderRef.current.stop()
                } catch {
                    // ignore
                }
            }
            cleanupRecording()
            setPreview((current) => {
                if (current?.url) URL.revokeObjectURL(current.url)
                return null
            })
        }
    }, [cleanupRecording])

    return {
        status,
        elapsedMs,
        levels,
        preview,
        error,
        maxDurationMs,
        isActive: status === 'requesting' || status === 'recording' || status === 'preview',
        isRecording: status === 'recording' || status === 'requesting',
        start,
        stop,
        discard
    }
}
