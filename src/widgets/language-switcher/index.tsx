'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { ActionIcon, Menu } from '@mantine/core'
import { Languages } from 'lucide-react'
import { cn } from '@/shared/utils'

type LanguageSwitcherProps = {
    /** One click toggles RU ↔ EN (no dropdown). */
    instant?: boolean
    className?: string
}

const LOCALES = ['ru', 'en'] as const

export const LanguageSwitcher = ({ instant = false, className }: LanguageSwitcherProps) => {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const t = useTranslations()

    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${locale}`), '') || '/'

    const switchTo = (next: (typeof LOCALES)[number]) => {
        if (next === locale) return
        router.push(`/${next}${pathWithoutLocale}`)
    }

    if (instant) {
        const next = locale === 'ru' ? 'en' : 'ru'
        const nextLabel = next.toUpperCase()

        return (
            <button
                type="button"
                onClick={() => switchTo(next)}
                className={cn(
                    'text-muted-foreground hover:text-foreground hover:bg-muted/60 inline-flex size-9 items-center justify-center rounded-[var(--radius-button)] transition-colors',
                    className
                )}
                aria-label={`${t('change-language-title')}: ${nextLabel}`}
                title={`${t('change-language-title')} → ${nextLabel}`}
            >
                <Languages size={18} strokeWidth={1.75} />
            </button>
        )
    }

    const languages = [
        { value: 'en' as const, label: 'EN' },
        { value: 'ru' as const, label: 'RU' }
    ]

    return (
        <Menu shadow="md" width={120} position="top-end" withinPortal>
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="lg" aria-label={t('change-language-title')} className={className}>
                    <Languages size={18} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {languages.map((lang) => (
                    <Menu.Item
                        key={lang.value}
                        disabled={locale === lang.value}
                        onClick={() => switchTo(lang.value)}
                    >
                        {lang.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}
