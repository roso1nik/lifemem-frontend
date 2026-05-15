/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, Group, Text, Button } from '@mantine/core'
import { cn } from '@/shared/utils'

interface LanguageSwitcherProps {
    className?: string
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${locale}`), '') || '/'

    const languages = [
        { value: 'en', label: 'English', icon: '/images/emojis/flag-uk.svg' },
        { value: 'ru', label: 'Русский', icon: '/images/emojis/flag-russia.svg' }
    ]

    const handleChange = (value: string) => {
        router.push(`/${value}${pathWithoutLocale}`)
    }

    const currentLang = languages.find((lang) => lang.value === locale)

    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            withinPortal
        >
            <Menu.Target>
                <Button
                    variant="default"
                    size="md"
                    radius="md"
                    title={t('change-language-title') || 'Change language'}
                    className={cn(className, 'w-full!')}
                >
                    {currentLang?.label}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>{t('select-language') || 'Select language'}</Menu.Label>
                {languages.map((lang) => (
                    <Menu.Item
                        key={lang.value}
                        onClick={() => handleChange(lang.value)}
                        disabled={locale === lang.value}
                    >
                        <Group>
                            <Text>{lang.label}</Text>
                            {locale === lang.value && <Text size="xs">✓</Text>}
                        </Group>
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}
