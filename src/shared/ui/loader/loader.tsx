'use client'

import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/utils'
import classes from './loader.module.css'

export type LoaderVariant = 'page' | 'section' | 'inline'
export type LoaderSize = 'sm' | 'md' | 'lg'

export type LoaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    variant?: LoaderVariant
    size?: LoaderSize
    /** Custom label. `false` hides text. Default for page/section; hidden for inline */
    label?: ReactNode | false
}

const spinnerSizeClass: Record<LoaderSize, string> = {
    sm: classes.spinnerSm,
    md: classes.spinnerMd,
    lg: classes.spinnerLg
}

const defaultSize: Record<LoaderVariant, LoaderSize> = {
    page: 'lg',
    section: 'md',
    inline: 'sm'
}

const defaultLabel = 'Loading…'

export const Loader = ({
    variant = 'section',
    size,
    label,
    className,
    ...props
}: LoaderProps) => {
    const resolvedSize = size ?? defaultSize[variant]

    const resolvedLabel =
        label === false
            ? null
            : label !== undefined
              ? label
              : variant === 'inline'
                ? null
                : defaultLabel

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={cn(classes.root, classes[variant], className)}
            {...props}
        >
            <span className={cn(classes.spinner, spinnerSizeClass[resolvedSize])} aria-hidden />
            {resolvedLabel != null && <p className={classes.label}>{resolvedLabel}</p>}
        </div>
    )
}

/** Full-viewport loading for route `loading.tsx` and auth guards */
export const LoadingPageNext = () => <Loader variant="page" />
