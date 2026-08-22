'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { APP_NAME } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { IconButton } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { ThemeSwitcher } from '@/widgets/theme'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { CtaLink } from './cta-link'

const ANCHORS = ['graph', 'search', 'privacy'] as const

export const LandingNav = () => {
    const t = useTranslations('landing')
    const [open, setOpen] = useState(false)
    const toggleMenu = useCallback(() => setOpen((value) => !value), [])
    const closeMenu = useCallback(() => setOpen(false), [])

    return (
        <header className="border-hairline bg-surface-frost/80 sticky top-0 z-40 h-16 border-b backdrop-blur-xl">
            <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 md:px-6">
                <Link
                    href={ROUTES.WELCOME}
                    className="text-primary shrink-0 text-[17px] font-semibold tracking-tight lowercase no-underline"
                >
                    {APP_NAME}
                </Link>

                <nav className="ml-6 hidden items-center gap-5 lg:flex" aria-label="Landing">
                    {ANCHORS.map((id) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            className="text-muted-foreground hover:text-foreground text-sm font-medium tracking-tight no-underline"
                        >
                            {t(`nav.${id}`)}
                        </a>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <div className="hidden sm:contents">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                    <CtaLink href={ROUTES.LOGIN} variant="ghost" size="sm" className="hidden sm:inline-flex">
                        {t('signIn')}
                    </CtaLink>
                    <CtaLink href={ROUTES.REGISTER} size="sm">
                        {t('getStarted')}
                    </CtaLink>
                    <IconButton
                        size="sm"
                        className="lg:hidden!"
                        aria-label={open ? t('nav.close') : t('nav.menu')}
                        aria-expanded={open}
                        onClick={toggleMenu}
                    >
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </IconButton>
                </div>
            </div>

            <div
                className={cn(
                    'border-hairline bg-surface-frost/95 absolute inset-x-0 top-16 border-b lg:hidden',
                    open ? 'block' : 'hidden'
                )}
            >
                <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Landing mobile">
                    {ANCHORS.map((id) => (
                        <a
                            key={id}
                            href={`#${id}`}
                            onClick={closeMenu}
                            className="text-foreground rounded-xl px-3 py-2 text-sm font-medium no-underline"
                        >
                            {t(`nav.${id}`)}
                        </a>
                    ))}
                    <CtaLink href={ROUTES.LOGIN} variant="subtle" size="sm" className="mt-1 sm:hidden">
                        {t('signIn')}
                    </CtaLink>
                    <div className="mt-2 flex items-center gap-1 sm:hidden">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                </nav>
            </div>
        </header>
    )
}
