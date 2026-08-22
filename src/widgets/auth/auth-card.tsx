'use client'

import { FC, ReactNode } from 'react'
import { ThemeSwitcher } from '../theme'
import { APP_NAME } from '@/shared/config'
import { useTranslations } from 'next-intl'

interface AuthCardProps {
    children: ReactNode
}

export const AuthCard: FC<AuthCardProps> = ({ children }) => {
    const t = useTranslations('auth')

    return (
        <>
            <div className="absolute top-4 right-4 z-10">
                <ThemeSwitcher />
            </div>

            <div className="mb-6 flex flex-col items-center gap-2 text-center">
                <p className="text-primary text-3xl font-semibold tracking-tight lowercase">{APP_NAME}</p>
                <p className="text-muted-foreground text-sm">{t('tagline')}</p>
            </div>

            <div className="border-border/80 bg-card/90 w-full max-w-md rounded-2xl border p-6 shadow-sm backdrop-blur-sm">
                {children}
            </div>

            <p className="text-muted-foreground mt-8 text-sm">
                © {new Date().getFullYear()} {APP_NAME}. {t('rights')}
            </p>
        </>
    )
}
