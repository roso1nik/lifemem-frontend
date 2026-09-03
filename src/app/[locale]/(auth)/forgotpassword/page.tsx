'use client'

import { ROUTES } from '@/shared/router'
import { Button, TextInput } from '@/shared/ui'
import { Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const ForgotPasswordPage = () => {
    const t = useTranslations('auth')

    return (
        <div className="flex flex-col gap-1">
            <h2 className="mb-1 text-lg font-semibold tracking-tight">{t('forgotTitle')}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{t('forgotUnavailable')}</p>
            <div className="mb-4">
                <TextInput placeholder={t('emailPlaceholder')} leftSection={<Mail size={16} />} disabled />
            </div>
            <Button fullWidth disabled>
                {t('forgotSubmit')}
            </Button>
            <Link href={ROUTES.LOGIN} className="text-primary mt-4 text-center text-sm hover:underline">
                {t('backToLogin')}
            </Link>
        </div>
    )
}

export default ForgotPasswordPage
