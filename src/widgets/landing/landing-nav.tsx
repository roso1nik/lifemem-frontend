'use client'

import { useCallback, useState } from 'react'
import { useBodyScrollLock } from './use-body-scroll-lock'
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
import { LandingSectionLink } from './landing-section-link'

const PRIMARY_ANCHORS = ['how', 'graph', 'ask', 'pricing'] as const
const MORE_ANCHORS = ['capture', 'places', 'privacy'] as const

export const LandingNav = () => {
    const t = useTranslations('landing')
    const [open, setOpen] = useState(false)
    const toggleMenu = useCallback(() => setOpen((value) => !value), [])
    const closeMenu = useCallback(() => setOpen(false), [])
    useBodyScrollLock(open)

    return (
        <header className="relative sticky top-0 z-40 px-3 pt-3 sm:px-4 md:px-6">
            <div className="border-hairline bg-surface-frost/88 mx-auto flex max-w-7xl items-center gap-2 rounded-[var(--radius-card)] border px-2 py-2 shadow-[0_8px_32px_-12px_color-mix(in_srgb,var(--foreground)_18%,transparent)] backdrop-blur-xl sm:gap-3 sm:px-3">
                <Link
                    href={ROUTES.WELCOME}
                    className="font-brand text-primary shrink-0 rounded-[var(--radius-button)] px-2 py-1.5 text-[17px] font-semibold tracking-tight lowercase no-underline"
                >
                    {APP_NAME}
                </Link>

                <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex" aria-label="Landing">
                    <div className="bg-muted/45 flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {PRIMARY_ANCHORS.map((id) => (
                            <LandingSectionLink
                                key={id}
                                sectionId={id}
                                className="text-muted-foreground hover:text-foreground hover:bg-card/90 rounded-full px-3 py-1.5 text-[12.5px] font-medium tracking-tight whitespace-nowrap no-underline transition-colors"
                            >
                                {t(`nav.${id}`)}
                            </LandingSectionLink>
                        ))}
                        <div className="relative hidden lg:block">
                            <details className="group">
                                <summary className="text-muted-foreground hover:text-foreground hover:bg-card/90 list-none cursor-pointer rounded-full px-3 py-1.5 text-[12.5px] font-medium tracking-tight whitespace-nowrap transition-colors [&::-webkit-details-marker]:hidden">
                                    {t('nav.more')}
                                </summary>
                                <div className="border-hairline bg-card/95 absolute top-full left-1/2 z-50 mt-2 min-w-[10rem] -translate-x-1/2 rounded-[var(--radius-card)] border p-1.5 shadow-lg">
                                    {MORE_ANCHORS.map((id) => (
                                        <LandingSectionLink
                                            key={id}
                                            sectionId={id}
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted/60 block rounded-[var(--radius-button)] px-3 py-2 text-sm font-medium no-underline"
                                        >
                                            {t(`nav.${id}`)}
                                        </LandingSectionLink>
                                    ))}
                                </div>
                            </details>
                        </div>
                    </div>
                </nav>

                <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
                    <div className="hidden items-center gap-0.5 sm:flex">
                        <ThemeSwitcher />
                        <LanguageSwitcher instant />
                    </div>
                    <CtaLink href={ROUTES.LOGIN} variant="ghost" size="sm" className="hidden md:inline-flex">
                        {t('signIn')}
                    </CtaLink>
                    <CtaLink href={ROUTES.REGISTER} size="sm" className="inline-flex max-sm:px-3">
                        <span className="hidden min-[400px]:inline">{t('getStarted')}</span>
                        <span className="min-[400px]:hidden">{t('nav.getStartedShort')}</span>
                    </CtaLink>
                    <IconButton
                        size="md"
                        className="lg:hidden!"
                        aria-label={open ? t('nav.close') : t('nav.menu')}
                        aria-expanded={open}
                        onClick={toggleMenu}
                    >
                        {open ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
                    </IconButton>
                </div>
            </div>

            <div
                className={cn(
                    'border-hairline bg-surface-frost/95 absolute inset-x-3 top-[calc(100%+0.25rem)] rounded-[var(--radius-card)] border shadow-lg backdrop-blur-xl transition-all duration-200 sm:inset-x-4 lg:hidden',
                    open ? 'visible max-h-[min(70vh,520px)] overflow-y-auto opacity-100' : 'pointer-events-none max-h-0 overflow-hidden opacity-0'
                )}
            >
                <nav className="flex flex-col gap-0.5 p-2" aria-label="Landing mobile">
                    {[...PRIMARY_ANCHORS, ...MORE_ANCHORS].map((id) => (
                        <LandingSectionLink
                            key={id}
                            sectionId={id}
                            onNavigate={closeMenu}
                            className="text-foreground hover:bg-muted/70 rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-medium no-underline"
                        >
                            {t(`nav.${id}`)}
                        </LandingSectionLink>
                    ))}
                    <div className="border-hairline mt-1 flex flex-col gap-2 border-t pt-3">
                        <CtaLink href={ROUTES.REGISTER} size="md" className="w-full" onClick={closeMenu}>
                            {t('getStarted')}
                        </CtaLink>
                        <CtaLink href={ROUTES.LOGIN} variant="subtle" size="md" className="w-full" onClick={closeMenu}>
                            {t('signIn')}
                        </CtaLink>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 pb-1">
                        <ThemeSwitcher />
                        <LanguageSwitcher instant />
                    </div>
                </nav>
            </div>
        </header>
    )
}
