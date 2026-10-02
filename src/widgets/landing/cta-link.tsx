'use client'

import type { MouseEvent } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/shared/utils'
import classes from '@/shared/ui/button/button.module.css'
import { scrollToLandingSection } from './scroll-to-landing-section'

type CtaLinkProps = {
    href: string
    children: React.ReactNode
    variant?: 'filled' | 'subtle' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
    onClick?: () => void
}

export const CtaLink = ({ href, children, variant = 'filled', size = 'md', className, onClick }: CtaLinkProps) => {
    const classNames = cn(
        classes.root,
        classes[variant],
        classes[size],
        'inline-flex items-center justify-center rounded-[var(--radius-button)] px-4 whitespace-nowrap no-underline',
        className
    )

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (href.startsWith('#')) {
            event.preventDefault()
            scrollToLandingSection(href.slice(1))
        }
        onClick?.()
    }

    if (href.startsWith('#')) {
        return (
            <a href={href} onClick={handleClick} className={classNames}>
                {children}
            </a>
        )
    }

    return (
        <Link href={href} onClick={onClick} className={classNames}>
            {children}
        </Link>
    )
}
