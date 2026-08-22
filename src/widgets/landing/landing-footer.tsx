'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { APP_NAME } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { LanguageSwitcher } from '@/widgets/language-switcher'

export const LandingFooter = () => {
    const t = useTranslations('landing')
    const year = new Date().getFullYear()

    return (
        <footer className="border-hairline border-t">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:px-6">
                <p className="text-primary text-sm font-semibold tracking-tight lowercase">{APP_NAME}</p>
                <p className="text-muted-foreground text-sm">
                    © {year} {APP_NAME}. {t('footer.rights')}
                </p>
                <div className="flex items-center gap-4 md:ml-auto">
                    <Link href={ROUTES.LOGIN} className="text-muted-foreground hover:text-foreground text-sm no-underline">
                        {t('signIn')}
                    </Link>
                    <Link
                        href={ROUTES.REGISTER}
                        className="text-muted-foreground hover:text-foreground text-sm no-underline"
                    >
                        {t('getStarted')}
                    </Link>
                    <LanguageSwitcher />
                </div>
            </div>
        </footer>
    )
}
