'use client'

import { APP_NAME } from '@/shared/config'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { Button } from '@mantine/core'
import { useTranslations } from 'next-intl'

export const NoAuthPage = () => {
    const t = useTranslations('admin')

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="font-brand text-primary text-2xl font-semibold tracking-tight lowercase">{APP_NAME}</p>
            <p className="text-muted-foreground max-w-sm text-sm">{t('noAccess')}</p>
            <Button component={Link} href={ROUTES.HOME_PAGE} variant="light">
                {t('back')}
            </Button>
        </div>
    )
}
