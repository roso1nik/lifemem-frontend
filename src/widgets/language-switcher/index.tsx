'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { ActionIcon, Menu } from '@mantine/core'
import { Languages } from 'lucide-react'
import { useUpdateUserSettings } from '@/entities/user-settings/api/use-user-settings'

export const LanguageSwitcher = () => {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const { mutate: updateSettings } = useUpdateUserSettings()

    const languages = [
        { value: 'en' as const, label: 'EN' },
        { value: 'ru' as const, label: 'RU' }
    ]

    const switchTo = (lang: 'en' | 'ru') => {
        if (lang === locale) return
        updateSettings(
            { lang },
            {
                onSuccess: () => {
                    router.replace(pathname, { locale: lang })
                },
                onError: () => {
                    router.replace(pathname, { locale: lang })
                }
            }
        )
    }

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
                        onClick={() => switchTo(lang.value)}
                    >
                        {lang.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    )
}
