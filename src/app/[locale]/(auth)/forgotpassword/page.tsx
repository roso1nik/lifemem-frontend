'use client'

import { ROUTES } from '@/shared/router'
import { AuthTabs } from '@/shared/ui'
import { Button, Input } from '@mantine/core'
import { Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
    const t = useTranslations('auth')

    return (
        <div className="flex flex-col gap-1">
            <AuthTabs active="login" />
            <h2 className="mb-1 text-lg font-semibold">{t('forgotTitle')}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{t('forgotHint')}</p>
            <div className="mb-4 flex flex-col gap-3">
                <Input size="md" placeholder={t('emailPlaceholder')} leftSection={<Mail size={16} />} />
            </div>
            <Button
                size="md"
                fullWidth
                onClick={() => toast.success('Скоро подключим API')}
            >
                {t('forgotSubmit')}
            </Button>
            <Link href={ROUTES.LOGIN} className="text-primary mt-4 text-center text-sm hover:underline">
                {t('backToLogin')}
            </Link>
        </div>
    )
}

export default ForgotPasswordPage
