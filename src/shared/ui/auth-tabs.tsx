'use client'

import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { Button } from '@mantine/core'
import { cn } from '@/shared/utils'
import { useTranslations } from 'next-intl'

type AuthTab = 'login' | 'register'

interface AuthTabsProps {
    active: AuthTab
}

export const AuthTabs = ({ active }: AuthTabsProps) => {
    const t = useTranslations('auth')

    return (
        <div className="bg-muted mb-5 flex w-full gap-1 rounded-xl p-1">
            <Link href={ROUTES.LOGIN} className="flex-1">
                <Button
                    fullWidth
                    variant={active === 'login' ? 'filled' : 'subtle'}
                    color={active === 'login' ? 'brandColors' : 'gray'}
                    className={cn(active !== 'login' && 'text-muted-foreground')}
                >
                    {t('login')}
                </Button>
            </Link>
            <Link href={ROUTES.REGISTER} className="flex-1">
                <Button
                    fullWidth
                    variant={active === 'register' ? 'filled' : 'subtle'}
                    color={active === 'register' ? 'brandColors' : 'gray'}
                    className={cn(active !== 'register' && 'text-muted-foreground')}
                >
                    {t('register')}
                </Button>
            </Link>
        </div>
    )
}
