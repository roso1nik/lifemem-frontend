'use client'

import { PasswordInput as MantinePasswordInput, PasswordInputProps as MantinePasswordInputProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './password-input.module.css'

export type PasswordInputProps = MantinePasswordInputProps

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, ...props }, ref) => {
        return <MantinePasswordInput ref={ref} className={cn(classes.wrapper, className)} {...props} />
    }
)

PasswordInput.displayName = 'PasswordInput'
