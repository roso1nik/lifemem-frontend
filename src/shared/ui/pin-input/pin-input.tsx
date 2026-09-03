'use client'

import { PinInput as MantinePinInput, PinInputProps as MantinePinInputProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './pin-input.module.css'

export type PinInputProps = MantinePinInputProps

export const PinInput = forwardRef<HTMLInputElement, PinInputProps>(
    ({ className, length = 6, type = 'number', oneTimeCode = true, ...props }, ref) => {
        return (
            <MantinePinInput
                ref={ref}
                className={cn(classes.wrapper, className)}
                length={length}
                type={type}
                oneTimeCode={oneTimeCode}
                {...props}
            />
        )
    }
)

PinInput.displayName = 'PinInput'
