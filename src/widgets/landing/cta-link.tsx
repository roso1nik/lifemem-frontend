'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/shared/utils'
import classes from '@/shared/ui/button/button.module.css'

type CtaLinkProps = {
    href: string
    children: React.ReactNode
    variant?: 'filled' | 'subtle' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export const CtaLink = ({ href, children, variant = 'filled', size = 'md', className }: CtaLinkProps) => {
    return (
        <Link
            href={href}
            className={cn(
                classes.root,
                classes[variant],
                classes[size],
                'inline-flex items-center justify-center rounded-[var(--radius-button)] px-4 whitespace-nowrap no-underline',
                className
            )}
        >
            {children}
        </Link>
    )
}
