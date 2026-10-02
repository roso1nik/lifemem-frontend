'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/shared/utils'
import { CAPTURE_CAROUSEL_PHOTOS } from './mock'
import { useInViewActive } from './use-in-view-active'

type CapturePhotoCarouselProps = {
    alt: string
    className?: string
}

const SWIPE = { type: 'spring' as const, bounce: 0, duration: 0.55 }
const SWIPE_THRESHOLD_PX = 48

export const CapturePhotoCarousel = ({ alt, className }: CapturePhotoCarouselProps) => {
    const reduce = useReducedMotion()
    const rootRef = useRef<HTMLDivElement>(null)
    const active = useInViewActive(rootRef)
    const [index, setIndex] = useState(0)
    const dragStartX = useRef<number | null>(null)

    const goTo = useCallback((next: number) => {
        const total = CAPTURE_CAROUSEL_PHOTOS.length
        setIndex(((next % total) + total) % total)
    }, [])

    const goNext = useCallback(() => goTo(index + 1), [goTo, index])
    const goPrev = useCallback(() => goTo(index - 1), [goTo, index])

    useEffect(() => {
        if (reduce || !active) return
        const id = window.setInterval(() => {
            setIndex((value) => (value + 1) % CAPTURE_CAROUSEL_PHOTOS.length)
        }, 3000)
        return () => window.clearInterval(id)
    }, [active, reduce])

    const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
        dragStartX.current = event.clientX
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (dragStartX.current === null) return
        const delta = event.clientX - dragStartX.current
        dragStartX.current = null
        if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
        if (delta < 0) goNext()
        else goPrev()
    }

    const onPointerCancel = () => {
        dragStartX.current = null
    }

    const slide = CAPTURE_CAROUSEL_PHOTOS[index]

    return (
        <div
            ref={rootRef}
            className={cn(className, 'touch-pan-y')}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
        >
            {reduce ? (
                <Image src={CAPTURE_CAROUSEL_PHOTOS[0]} alt={alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={slide}
                        className="absolute inset-0"
                        initial={{ x: '100%', opacity: 0.85 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0.85 }}
                        transition={SWIPE}
                    >
                        <Image src={slide} alt={alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                    </motion.div>
                </AnimatePresence>
            )}
            <div className="absolute bottom-14 left-4 flex gap-1.5">
                {CAPTURE_CAROUSEL_PHOTOS.map((_, dotIndex) => (
                    <button
                        key={dotIndex}
                        type="button"
                        aria-label={`${dotIndex + 1} / ${CAPTURE_CAROUSEL_PHOTOS.length}`}
                        aria-current={dotIndex === index ? 'true' : undefined}
                        onClick={() => goTo(dotIndex)}
                        className={cn(
                            'rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                            dotIndex === index ? 'bg-primary h-1.5 w-4' : 'bg-foreground/25 size-1.5 hover:bg-foreground/40'
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
