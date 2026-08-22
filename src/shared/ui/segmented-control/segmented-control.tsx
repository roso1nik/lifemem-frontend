'use client'

import { cn } from '@/shared/utils'
import classes from './segmented-control.module.css'

export type SegmentedOption<T extends string = string> = {
    value: T
    label: string
    href?: string
}

export type SegmentedControlProps<T extends string = string> = {
    value: T
    options: SegmentedOption<T>[]
    onChange?: (value: T) => void
    className?: string
    renderOption?: (option: SegmentedOption<T>, active: boolean) => React.ReactNode
}

export function SegmentedControl<T extends string>({
    value,
    options,
    onChange,
    className,
    renderOption
}: SegmentedControlProps<T>) {
    return (
        <div className={cn(classes.root, 'flex w-full', className)} role="tablist">
            {options.map((option) => {
                const active = option.value === value
                if (renderOption) {
                    return <div key={option.value} className="flex-1">{renderOption(option, active)}</div>
                }
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={cn(classes.control, active && classes.active)}
                        onClick={() => onChange?.(option.value)}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
