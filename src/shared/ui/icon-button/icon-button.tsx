'use client'

import { ActionIcon, type ActionIconProps } from '@mantine/core'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './icon-button.module.css'

export type IconButtonSize = 'sm' | 'md' | 'lg'

export type IconButtonProps = Omit<ActionIconProps, 'size' | 'variant'> &
    Omit<ComponentPropsWithoutRef<'button'>, keyof ActionIconProps | 'color'> & {
        size?: IconButtonSize
        tone?: 'default' | 'primary'
    }

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ size = 'md', tone = 'default', className, ...props }, ref) => {
        return (
            <ActionIcon
                ref={ref}
                variant={tone === 'primary' ? 'filled' : 'subtle'}
                color={tone === 'primary' ? 'brandColors' : 'gray'}
                className={cn(classes.root, classes[size], tone === 'primary' && classes.primary, className)}
                {...props}
            />
        )
    }
)

IconButton.displayName = 'IconButton'
