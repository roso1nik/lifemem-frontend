'use client'

import { LanguageSwitcher } from '@/widgets/language-switcher'
import { Logo } from '@/widgets/logo'
import { LayoutDashboard } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { LinkButtonPathCheck } from '@/shared/ui'

export const Sidebar = () => {
    const t = useTranslations()

    return (
        <div className="sticky top-0 flex h-screen flex-col">
            <div className="flex flex-col gap-3 lg:flex-1">
                <Logo />
                <div className="flex flex-1 flex-col gap-1">
                    <div className="flex w-full flex-col gap-1 p-2">
                        <LinkButtonPathCheck href={ROUTES.HOME_PAGE} leftSection={<LayoutDashboard size={18} />}>
                            {t('main-page')}
                        </LinkButtonPathCheck>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
                <LanguageSwitcher />

                {/* {isAuth ? (
                    <Button onClick={handleLogout} color="red">
                        Выйти
                    </Button>
                ) : (
                    <Link href={ROUTES.LOGIN}>
                        <Button fullWidth>Войти</Button>
                    </Link>
                )} */}
            </div>
        </div>
    )
}
