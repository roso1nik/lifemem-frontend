'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

type RevealProps = {
    children: ReactNode
    className?: string
    delay?: number
}

const HIDDEN = { opacity: 0, y: 20 }
const SHOWN = { opacity: 1, y: 0 }
const VIEWPORT = { once: true, amount: 0.2 } as const
const TRANSITION = { type: 'spring', bounce: 0, duration: 0.35 } as const

export const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
    const reduce = useReducedMotion()

    return (
        <motion.div
            className={className}
            initial={reduce ? false : HIDDEN}
            whileInView={SHOWN}
            viewport={VIEWPORT}
            transition={{ ...TRANSITION, delay: reduce ? 0 : delay }}
        >
            {children}
        </motion.div>
    )
}
