'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { useTranslations } from 'next-intl'
import { removeLocalePrefix } from '@/i18n/routing'

const NAV = [
    { href: ROUTES.ADMIN_USERS, key: 'nav.users' as const },
    { href: ROUTES.ADMIN_SETTINGS, key: 'nav.settings' as const },
    { href: ROUTES.ADMIN_MODELS, key: 'nav.models' as const },
    { href: ROUTES.ADMIN_LOGS, key: 'nav.logs' as const },
    { href: ROUTES.ADMIN_AUTH_LOGS, key: 'nav.authLogs' as const },
    { href: ROUTES.ADMIN_HEALTH, key: 'nav.health' as const }
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const t = useTranslations('admin')
    const pathname = usePathname()
    const path = removeLocalePrefix(pathname)

    return (
        // <PermissionGuard permission={PermissionValue.ADMIN_PANEL}>
        <>
            <div className="bg-background text-foreground min-h-screen">
                <div className="border-hairline mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
                    <div className="border-hairline flex items-center justify-between gap-3 border-b pb-4">
                        <h1 className="text-lg font-semibold tracking-tight">{t('title')}</h1>
                        <Link href={ROUTES.HOME_PAGE} className="text-primary text-sm hover:underline">
                            {t('back')}
                        </Link>
                    </div>

                    <nav className="border-hairline flex flex-wrap gap-1 border-b pb-3">
                        {NAV.map((item) => {
                            const active = path === item.href || path.startsWith(`${item.href}/`)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'rounded-lg px-3 py-1.5 text-sm transition-colors active:scale-[0.97]',
                                        active
                                            ? 'bg-accent text-primary font-medium'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    {t(item.key)}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="min-h-0 flex-1 pb-10">{children}</div>
                </div>
            </div>
        </>
    )
}
