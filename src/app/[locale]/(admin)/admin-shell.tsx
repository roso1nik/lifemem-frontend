'use client'

import { CheckAuthProvider } from '@/widgets/check-auth'
import { Link } from '@/i18n/navigation'
import { ROUTES } from '@/shared/router'
import { useTranslations } from 'next-intl'

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const t = useTranslations('admin')

    return (
        <CheckAuthProvider>
            <div className="bg-background text-foreground min-h-screen p-6">
                <div className="mb-6 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                    <h1 className="text-lg font-semibold">{t('title')}</h1>
                    <Link href={ROUTES.HOME_PAGE} className="text-primary text-sm hover:underline">
                        {t('back')}
                    </Link>
                </div>
                {children}
            </div>
        </CheckAuthProvider>
    )
}
