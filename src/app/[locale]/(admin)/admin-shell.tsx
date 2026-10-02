'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { PermissionGuard } from '@/features/auth-guard'
import { PermissionValue } from '@/entities/permissions/const/permission-map'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { useTranslations } from 'next-intl'
import { removeLocalePrefix } from '@/i18n/routing'
import {
    ArrowLeft,
    Cpu,
    HeartPulse,
    ScrollText,
    Settings,
    Shield,
    Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { AdminAtmosphere, AdminSectionIcon } from '@/widgets/admin-shared/chrome'

const NAV: {
    href: string
    key: 'nav.users' | 'nav.settings' | 'nav.models' | 'nav.logs' | 'nav.authLogs' | 'nav.health'
    Icon: LucideIcon
    tone: 'aqua' | 'sage'
}[] = [
    { href: ROUTES.ADMIN_USERS, key: 'nav.users', Icon: Users, tone: 'aqua' },
    { href: ROUTES.ADMIN_SETTINGS, key: 'nav.settings', Icon: Settings, tone: 'sage' },
    { href: ROUTES.ADMIN_MODELS, key: 'nav.models', Icon: Cpu, tone: 'aqua' },
    { href: ROUTES.ADMIN_LOGS, key: 'nav.logs', Icon: ScrollText, tone: 'sage' },
    { href: ROUTES.ADMIN_AUTH_LOGS, key: 'nav.authLogs', Icon: Shield, tone: 'aqua' },
    { href: ROUTES.ADMIN_HEALTH, key: 'nav.health', Icon: HeartPulse, tone: 'sage' }
]

const sectionSubtitleKey = (path: string): string => {
    const match = NAV.find((item) => path === item.href || path.startsWith(`${item.href}/`))
    if (!match) return 'subtitle'
    return `section.${match.key.split('.')[1]}`
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const t = useTranslations('admin')
    const pathname = usePathname()
    const path = removeLocalePrefix(pathname)
    const activeNav = NAV.find((item) => path === item.href || path.startsWith(`${item.href}/`))
    const subtitle = t(sectionSubtitleKey(path) as 'subtitle')

    return (
        <PermissionGuard permission={PermissionValue.ADMIN_PANEL}>
            <AdminAtmosphere>
                <header className="border-hairline bg-surface-frost/75 sticky top-0 z-20 border-b backdrop-blur-2xl">
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3.5 md:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <AdminSectionIcon Icon={activeNav?.Icon ?? Shield} tone={activeNav?.tone ?? 'aqua'} />
                            <div className="min-w-0">
                                <p className="text-primary text-[11px] font-semibold tracking-[0.14em] uppercase">
                                    {t('title')}
                                </p>
                                <h1 className="truncate text-xl font-semibold tracking-tight">
                                    {activeNav ? t(activeNav.key) : t('title')}
                                </h1>
                            </div>
                        </div>
                        <Link
                            href={ROUTES.HOME_PAGE}
                            className="border-hairline bg-card/70 text-foreground hover:bg-muted inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-transform active:scale-[0.97]"
                        >
                            <ArrowLeft size={14} className="text-primary" />
                            {t('back')}
                        </Link>
                    </div>
                </header>

                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
                    <motion.p
                        key={path}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                        className="text-muted-foreground max-w-2xl text-[15px] leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>

                    <nav className="border-hairline bg-surface-frost/80 flex flex-wrap gap-1 rounded-[20px] border p-1.5 shadow-[0_8px_28px_color-mix(in_srgb,var(--foreground)_5%,transparent)] backdrop-blur-xl">
                        {NAV.map(({ href, key, Icon }) => {
                            const active = path === href || path.startsWith(`${href}/`)
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        'relative inline-flex items-center gap-1.5 rounded-[14px] px-3 py-2 text-sm transition-colors active:scale-[0.97]',
                                        active
                                            ? 'text-primary font-semibold'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="admin-nav-pill"
                                            className="bg-accent/90 absolute inset-0 -z-10 rounded-[14px] shadow-sm"
                                            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                                        />
                                    )}
                                    <Icon size={14} strokeWidth={1.85} />
                                    {t(key)}
                                </Link>
                            )
                        })}
                    </nav>

                    <motion.div
                        key={path + '-body'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="min-h-0 flex-1 pb-12"
                    >
                        {children}
                    </motion.div>
                </div>
            </AdminAtmosphere>
        </PermissionGuard>
    )
}
