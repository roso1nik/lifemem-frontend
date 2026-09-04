'use client'

import { forwardRef } from 'react'
import { Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TextInput, type TextInputProps } from '@/shared/ui/text-input'
import { cn } from '@/shared/utils'
import {
    formatPhoneNumber,
    getPhoneHintState,
    normalizePhoneInput
} from '@/shared/utils/format-phone-number'
import classes from './phone-input.module.css'

export type PhoneInputProps = Omit<TextInputProps, 'type' | 'value' | 'onChange' | 'leftSection'> & {
    value?: string
    onChange?: (value: string) => void
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value = '', onChange, description, className, classNames, placeholder, ...props }, ref) => {
        const t = useTranslations('auth')
        const formatted = formatPhoneNumber(value)
        const hint = getPhoneHintState(formatted)

        const resolvedDescription =
            description ??
            (hint.kind === 'valid'
                ? t('phoneHintValid')
                : hint.kind === 'progress'
                  ? t('phoneHintRemaining', { count: hint.remaining, mask: hint.mask })
                  : t('phoneHintDefault'))

        return (
            <TextInput
                ref={ref}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                leftSection={<Phone size={16} />}
                value={formatted}
                placeholder={placeholder ?? t('phonePlaceholder')}
                description={resolvedDescription}
                className={cn(classes.root, className)}
                classNames={classNames}
                onChange={(event) => {
                    const next = event.currentTarget.value
                    if (!next.trim()) {
                        onChange?.('')
                        return
                    }
                    onChange?.(formatPhoneNumber(normalizePhoneInput(next)))
                }}
                {...props}
            />
        )
    }
)

PhoneInput.displayName = 'PhoneInput'
