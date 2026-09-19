'use client'

import { useEffect, useState, type RefObject } from 'react'

export const useInViewActive = (ref: RefObject<Element | null>, rootMargin = '120px 0px') => {
    const [active, setActive] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setActive(entry?.isIntersecting ?? false)
            },
            { rootMargin, threshold: 0.05 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [ref, rootMargin])

    return active
}
