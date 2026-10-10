'use client'

import { Select as MantineSelect, type SelectProps as MantineSelectProps } from '@mantine/core'
import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import classes from './select.module.css'

export type SelectProps = MantineSelectProps

export const Select = forwardRef<HTMLInputElement, SelectProps>(
    ({ className, classNames, comboboxProps, ...props }, ref) => {
        return (
            <MantineSelect
                ref={ref}
                className={cn(classes.wrapper, className)}
                classNames={{
                    dropdown: classes.dropdown,
                    option: classes.option,
                    ...classNames
                }}
                comboboxProps={{
                    withinPortal: true,
                    ...comboboxProps
                }}
                {...props}
            />
        )
    }
)

Select.displayName = 'Select'
