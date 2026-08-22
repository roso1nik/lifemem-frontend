'use client'

import { Textarea as MantineTextarea, TextareaProps as MantineTextareaProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './textarea.module.css'

export type TextareaProps = MantineTextareaProps & {
    bordered?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, bordered = false, variant, ...props }, ref) => {
        return (
            <MantineTextarea
                ref={ref}
                variant={bordered ? 'default' : 'unstyled'}
                className={cn(classes.wrapper, bordered && classes.bordered, className)}
                {...props}
            />
        )
    }
)

Textarea.displayName = 'Textarea'
