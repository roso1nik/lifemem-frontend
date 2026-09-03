'use client'

import { FC, ReactNode } from 'react'
import { ThemeSwitcher } from '../theme'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { APP_NAME } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Surface } from '@/shared/ui'

interface AuthCardProps {
    children: ReactNode
}

export const AuthCard: FC<AuthCardProps> = ({ children }) => {
    const t = useTranslations('auth')

    return (
        <>
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <p className="font-brand text-primary text-3xl font-semibold tracking-tight lowercase">{APP_NAME}</p>
                <p className="text-muted-foreground text-sm">{t('tagline')}</p>
            </div>

            <Surface className="w-full max-w-md p-6">{children}</Surface>

            <div className="mt-5 flex w-full max-w-md items-center justify-between">
                <Link
                    href={ROUTES.WELCOME}
                    className="text-muted-foreground hover:text-primary text-sm no-underline"
                >
                    {'Что это?'}
                </Link>
                <div className="flex items-center gap-1">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
            </div>

            <p className="text-muted-foreground mt-6 text-sm">
                © {new Date().getFullYear()} {APP_NAME}. {t('rights')}
            </p>
        </>
    )
}
