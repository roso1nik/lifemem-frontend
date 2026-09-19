'use client'

import { useEffect, useState, type RefObject } from 'react'

export const useInViewActive = (ref: RefObject<Element | null>, rootMargin = '120px 0px') => {
    const [active, setActive] = useState(false)

    useEffect(() => {
        let observer: IntersectionObserver | null = null
        let raf = 0

        const cleanup = () => {
            if (raf) cancelAnimationFrame(raf)
            observer?.disconnect()
            observer = null
        }

        const bind = () => {
            const el = ref.current
            if (!el) {
                raf = requestAnimationFrame(bind)
                return
            }

            observer = new IntersectionObserver(
                ([entry]) => {
                    setActive(entry?.isIntersecting ?? false)
                },
                { rootMargin, threshold: 0.05 }
            )
            observer.observe(el)
        }

        bind()
        return cleanup
    }, [rootMargin, ref])

    return active
}
