'use client'

import { useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useGetUserSettings } from '@/entities/user-settings/api/use-user-settings'

/** Sync next-intl locale with GET /user-settings.lang once after login. */
export const UserSettingsLocaleSync = () => {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const { data } = useGetUserSettings()
    const appliedRef = useRef<string | null>(null)

    useEffect(() => {
        if (!data) return
        const lang = data.lang === 'ru' || data.lang === 'en' ? data.lang : null
        if (!lang) return
        if (appliedRef.current === `${data.lang}:${locale}`) return
        appliedRef.current = `${data.lang}:${locale}`
        if (lang !== locale) {
            router.replace(pathname, { locale: lang })
        }
    }, [data, locale, pathname, router])

    return null
}
