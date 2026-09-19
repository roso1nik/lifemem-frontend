'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    type ReactNode
} from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/shared/utils'

const MIN_SCALE = 0.978
const MAX_SCALE = 1.006
const FOCUS_RANGE_RATIO = 0.62
const EFFECT_START = 0.22

const smoothstep = (t: number) => t * t * (3 - 2 * t)

type RegisterFn = (key: string, node: HTMLElement | null) => void

const ScrollFocusRegistry = createContext<RegisterFn | null>(null)

export const ScrollFocusProvider = ({ children }: { children: ReactNode }) => {
    const reduce = useReducedMotion()
    const nodes = useRef(new Map<string, HTMLElement>())

    const register = useCallback<RegisterFn>((key, node) => {
        if (node) nodes.current.set(key, node)
        else nodes.current.delete(key)
    }, [])

    useEffect(() => {
        if (reduce) return

        const desktop = window.matchMedia('(min-width: 1024px)')
        let raf = 0

        const apply = () => {
            if (!desktop.matches) {
                nodes.current.forEach((el) => {
                    el.style.transform = ''
                    el.style.opacity = ''
                })
                return
            }

            const vh = window.innerHeight
            const viewCenter = vh / 2
            const range = vh * FOCUS_RANGE_RATIO

            nodes.current.forEach((el) => {
                const rect = el.getBoundingClientRect()
                const blockCenter = rect.top + rect.height / 2
                const distance = Math.abs(blockCenter - viewCenter)
                const t = Math.min(distance / range, 1)
                const delayed = Math.max(0, (t - EFFECT_START) / (1 - EFFECT_START))
                const eased = smoothstep(delayed)
                const scale = MAX_SCALE - eased * (MAX_SCALE - MIN_SCALE)
                el.style.transform = `scale(${scale.toFixed(4)})`
                el.style.opacity = '1'
            })
        }

        const schedule = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(apply)
        }

        schedule()
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('resize', schedule)
        desktop.addEventListener('change', schedule)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', schedule)
            window.removeEventListener('resize', schedule)
            desktop.removeEventListener('change', schedule)
            nodes.current.forEach((el) => {
                el.style.transform = ''
                el.style.opacity = ''
            })
        }
    }, [reduce])

    if (reduce) {
        return <>{children}</>
    }

    return <ScrollFocusRegistry.Provider value={register}>{children}</ScrollFocusRegistry.Provider>
}

type ScrollFocusSectionProps = {
    children: ReactNode
    className?: string
}

export const ScrollFocusSection = ({ children, className }: ScrollFocusSectionProps) => {
    const reduce = useReducedMotion()
    const register = useContext(ScrollFocusRegistry)
    const ref = useRef<HTMLDivElement>(null)
    const key = useId()

    useEffect(() => {
        if (reduce || !register) return
        register(key, ref.current)
        return () => register(key, null)
    }, [key, reduce, register])

    if (reduce || !register) {
        return <div className={className}>{children}</div>
    }

    return (
        <div
            ref={ref}
            className={cn('relative z-0 will-change-transform lg:origin-[50%_45%]', className)}
        >
            {children}
        </div>
    )
}
