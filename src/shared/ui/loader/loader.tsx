'use client'

import { Loader as MantineLoader } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/shared/utils'
import classes from './loader.module.css'

export type LoaderVariant = 'page' | 'section' | 'inline'
export type LoaderSize = 'sm' | 'md' | 'lg'

export type LoaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    variant?: LoaderVariant
    size?: LoaderSize
    /** Custom label. `false` hides text. Default: `common.loading` for page/section; hidden for inline */
    label?: ReactNode | false
}

const mantineSize: Record<LoaderSize, number> = {
    sm: 18,
    md: 28,
    lg: 40
}

const defaultSize: Record<LoaderVariant, LoaderSize> = {
    page: 'lg',
    section: 'md',
    inline: 'sm'
}

export const Loader = ({
    variant = 'section',
    size,
    label,
    className,
    ...props
}: LoaderProps) => {
    const t = useTranslations('common')
    const resolvedSize = size ?? defaultSize[variant]

    const resolvedLabel =
        label === false
            ? null
            : label !== undefined
              ? label
              : variant === 'inline'
                ? null
                : t('loading')

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className={cn(classes.root, classes[variant], className)}
            {...props}
        >
            <MantineLoader color="brandColors" type="oval" size={mantineSize[resolvedSize]} />
            {resolvedLabel != null && <p className={classes.label}>{resolvedLabel}</p>}
        </div>
    )
}

/** Full-viewport loading for route `loading.tsx` and auth guards */
export const LoadingPageNext = () => <Loader variant="page" />
