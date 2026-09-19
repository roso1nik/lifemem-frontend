'use client'

import type { ReactNode } from 'react'
import { cn } from '@/shared/utils'
import { landingSectionHref, onLandingSectionAnchorClick } from './scroll-to-landing-section'

type LandingSectionLinkProps = {
    sectionId: string
    className?: string
    children: ReactNode
    onNavigate?: () => void
}

export const LandingSectionLink = ({ sectionId, className, children, onNavigate }: LandingSectionLinkProps) => (
    <a
        href={landingSectionHref(sectionId)}
        className={cn(
            className,
            'rounded-[var(--radius-button)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]'
        )}
        onClick={(event) => onLandingSectionAnchorClick(event, sectionId, onNavigate)}
    >
        {children}
    </a>
)
