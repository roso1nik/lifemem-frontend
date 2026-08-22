'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { ActionIcon, Menu } from '@mantine/core'
import { Languages } from 'lucide-react'

export const LanguageSwitcher = () => {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${locale}`), '') || '/'

    const languages = [
        { value: 'en', label: 'EN' },
        { value: 'ru', label: 'RU' }
    ]

    return (
        <Menu shadow="md" width={120} position="top-end" withinPortal>
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Language">
                    <Languages size={18} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {languages.map((lang) => (
                    <Menu.Item
                        key={lang.value}
                        disabled={locale === lang.value}
                        onClick={() => router.push(`/${lang.value}${pathWithoutLocale}`)}
                    >
                        {lang.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}
