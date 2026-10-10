'use client'

import { PinInput as MantinePinInput, type PinInputProps as MantinePinInputProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './pin-input.module.css'

export type PinInputProps = MantinePinInputProps

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(
    (
        {
            className,
            classNames,
            length = 6,
            type = 'number',
            oneTimeCode = true,
            size = 'md',
            radius = 'md',
            gap = 8,
            placeholder = '·',
            ...props
        },
        ref
    ) => {
        const extra = typeof classNames === 'object' && classNames ? classNames : undefined

        return (
            <MantinePinInput
                rootRef={ref}
                classNames={{
                    ...extra,
                    root: cn(classes.root, extra?.root, className),
                    input: cn(classes.input, extra?.input)
                }}
                length={length}
                type={type}
                oneTimeCode={oneTimeCode}
                size={size}
                radius={radius}
                gap={gap}
                placeholder={placeholder}
                inputMode="numeric"
                {...props}
            />
        )
    }
)

PinInput.displayName = 'PinInput'
