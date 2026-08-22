'use client'

import { useTranslations } from 'next-intl'

export default function AdminPage() {
    const t = useTranslations('admin')
    return <p className="text-muted-foreground text-sm">{t('placeholder')}</p>
}
