'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

type RevealProps = {
    children: ReactNode
    className?: string
    delay?: number
    staticOnMobile?: boolean
}

const HIDDEN = { opacity: 0, y: 20 }
const SHOWN = { opacity: 1, y: 0 }
const VIEWPORT = { once: true, amount: 0.2 } as const
const TRANSITION = { type: 'spring', bounce: 0, duration: 0.35 } as const

export const Reveal = ({ children, className, delay = 0, staticOnMobile = true }: RevealProps) => {
    const reduce = useReducedMotion()
    const [isLg, setIsLg] = useState(false)

    useEffect(() => {
        const media = window.matchMedia('(min-width: 1024px)')
        const sync = () => setIsLg(media.matches)
        sync()
        media.addEventListener('change', sync)
        return () => media.removeEventListener('change', sync)
    }, [])

    if (reduce || (staticOnMobile && !isLg)) {
        return <div className={className}>{children}</div>
    }

    return (
        <motion.div
            className={className}
            initial={HIDDEN}
            whileInView={SHOWN}
            viewport={VIEWPORT}
            transition={{ ...TRANSITION, delay }}
        >
            {children}
        </motion.div>
    )
}
