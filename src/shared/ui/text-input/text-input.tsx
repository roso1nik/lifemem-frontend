'use client'

import { TextInput as MantineTextInput, TextInputProps as MantineTextInputProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './text-input.module.css'

export type TextInputProps = MantineTextInputProps

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ className, classNames, ...props }, ref) => {
    return (
        <MantineTextInput
            ref={ref}
            className={cn(classes.wrapper, className)}
            classNames={classNames}
            {...props}
        />
    )
})

TextInput.displayName = 'TextInput'
