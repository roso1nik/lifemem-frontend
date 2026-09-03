'use client'

import { useGetUserSettings, useUpdateUserSettings } from '@/entities/user-settings/api/use-user-settings'
import { Button, SegmentedControl, Surface } from '@/shared/ui'
import { Switch } from '@mantine/core'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'

type Lang = 'ru' | 'en'

export const ProfileUserSettings = () => {
    const t = useTranslations('profile')
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const { data, isLoading } = useGetUserSettings()
    const { mutate: updateSettings, isPending } = useUpdateUserSettings()

    const [enableNotification, setEnableNotification] = useState(false)
    const [lang, setLang] = useState<Lang>((locale as Lang) || 'ru')

    useEffect(() => {
        if (!data) return
        setEnableNotification(data.enableNotification)
        if (data.lang === 'ru' || data.lang === 'en') setLang(data.lang)
    }, [data])

    const onSave = () => {
        updateSettings(
            { enableNotification, lang },
            {
                onSuccess: () => {
                    if (lang !== locale) {
                        router.replace(pathname, { locale: lang })
                    }
                }
            }
        )
    }

    if (isLoading) {
        return <p className="text-muted-foreground text-sm">{t('loading')}</p>
    }

    return (
        <Surface className="flex flex-col gap-4 p-4">
            <Switch
                checked={enableNotification}
                onChange={(e) => setEnableNotification(e.currentTarget.checked)}
                label={t('notifications')}
            />
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{t('language')}</p>
                <SegmentedControl
                    value={lang}
                    onChange={(value) => setLang(value as Lang)}
                    options={[
                        { value: 'ru', label: 'RU' },
                        { value: 'en', label: 'EN' }
                    ]}
                />
            </div>
            <Button type="button" loading={isPending} className="self-start" onClick={onSave}>
                {t('save')}
            </Button>
        </Surface>
    )
}
