import type { MouseEvent } from 'react'

import { LANDING_SCROLL_OFFSET_PX } from './landing-scroll'

const DEFAULT_OFFSET_PX = LANDING_SCROLL_OFFSET_PX

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let activeScrollFrame: number | null = null

export const scrollToLandingSection = (sectionId: string, offsetPx = DEFAULT_OFFSET_PX) => {
    if (typeof window === 'undefined') return

    const el = document.getElementById(sectionId)
    if (!el) return

    if (activeScrollFrame !== null) {
        cancelAnimationFrame(activeScrollFrame)
        activeScrollFrame = null
    }

    const targetTop = el.getBoundingClientRect().top + window.scrollY - offsetPx

    if (prefersReducedMotion()) {
        window.scrollTo({ top: targetTop, behavior: 'auto' })
        history.replaceState(null, '', `#${sectionId}`)
        return
    }

    const startTop = window.scrollY
    const distance = targetTop - startTop
    const duration = Math.min(980, Math.max(520, Math.abs(distance) * 0.55))
    let startTime: number | null = null

    const tick = (time: number) => {
        if (startTime === null) startTime = time
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        window.scrollTo(0, startTop + distance * easeInOutCubic(progress))
        if (progress < 1) {
            activeScrollFrame = requestAnimationFrame(tick)
        } else {
            activeScrollFrame = null
            history.replaceState(null, '', `#${sectionId}`)
        }
    }

    activeScrollFrame = requestAnimationFrame(tick)
}

export const landingSectionHref = (sectionId: string) => `#${sectionId}`

export const onLandingSectionAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    afterScroll?: () => void
) => {
    event.preventDefault()
    scrollToLandingSection(sectionId)
    afterScroll?.()
}
