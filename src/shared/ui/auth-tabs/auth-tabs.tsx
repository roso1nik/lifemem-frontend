'use client'

import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'

type AuthTab = 'login' | 'register'

interface AuthTabsProps {
    active: AuthTab
}

export const AuthTabs = ({ active }: AuthTabsProps) => {
    const t = useTranslations('auth')

    const tabs: { key: AuthTab; href: string; label: string }[] = [
        { key: 'login', href: ROUTES.LOGIN, label: t('login') },
        { key: 'register', href: ROUTES.REGISTER, label: t('register') }
    ]

    return (
        <div className="bg-muted mb-5 flex w-full gap-1 rounded-xl p-1" role="tablist">
            {tabs.map((tab) => {
                const isActive = active === tab.key
                return (
                    <Link
                        key={tab.key}
                        href={tab.href}
                        role="tab"
                        aria-selected={isActive}
                        className={cn(
                            'flex-1 rounded-[10px] py-2 text-center text-sm font-medium transition-colors',
                            'active:scale-[0.97]',
                            isActive
                                ? 'bg-card text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </div>
    )
}
