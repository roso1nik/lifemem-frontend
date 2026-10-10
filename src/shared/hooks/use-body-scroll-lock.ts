'use client'

import { useEffect } from 'react'

export const useBodyScrollLock = (locked: boolean) => {
    useEffect(() => {
        if (!locked) return

        const { body } = document
        const prevOverflow = body.style.overflow
        const prevPaddingRight = body.style.paddingRight
        const scrollbarGap = window.innerWidth - document.documentElement.clientWidth

        body.style.overflow = 'hidden'
        if (scrollbarGap > 0) {
            body.style.paddingRight = `${scrollbarGap}px`
        }

        return () => {
            body.style.overflow = prevOverflow
            body.style.paddingRight = prevPaddingRight
        }
    }, [locked])
}
