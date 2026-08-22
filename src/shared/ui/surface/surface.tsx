'use client'

import { cn } from '@/shared/utils'
import { HTMLAttributes, forwardRef } from 'react'
import classes from './surface.module.css'

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
    frost?: boolean
    capsule?: boolean
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
    ({ className, frost, capsule, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(classes.root, frost && classes.frost, capsule && classes.capsule, className)}
                {...props}
            />
        )
    }
)

Surface.displayName = 'Surface'
