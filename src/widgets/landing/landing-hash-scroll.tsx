'use client'

import { useEffect } from 'react'
import { scrollToLandingSection } from './scroll-to-landing-section'

export const LandingHashScroll = () => {
    useEffect(() => {
        const hash = window.location.hash.replace(/^#/, '')
        if (!hash) return

        const id = window.requestAnimationFrame(() => {
            scrollToLandingSection(hash)
        })
        return () => cancelAnimationFrame(id)
    }, [])

    return null
}
