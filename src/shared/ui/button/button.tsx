'use client'

import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './button.module.css'

export type ButtonVariant = 'filled' | 'subtle' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = Omit<MantineButtonProps, 'variant' | 'size'> &
    Omit<ComponentPropsWithoutRef<'button'>, keyof MantineButtonProps | 'color'> & {
        variant?: ButtonVariant
        size?: ButtonSize
    }

const mantineVariant: Record<ButtonVariant, MantineButtonProps['variant']> = {
    filled: 'filled',
    subtle: 'light',
    ghost: 'subtle',
    danger: 'filled'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = 'filled', size = 'md', className, color, ...props }, ref) => {
        return (
            <MantineButton
                ref={ref}
                variant={mantineVariant[variant]}
                color={variant === 'danger' ? 'red' : ((color as MantineButtonProps['color']) ?? 'brandColors')}
                className={cn(classes.root, classes[variant], classes[size], className)}
                {...props}
            />
        )
    }
)

Button.displayName = 'Button'
