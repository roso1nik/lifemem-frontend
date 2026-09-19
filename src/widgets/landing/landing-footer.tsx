'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { APP_NAME } from '@/shared/config'
import { SUPPORT_EMAIL } from '@/shared/config/site'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { LandingSectionLink } from './landing-section-link'
import { onLandingSectionAnchorClick } from './scroll-to-landing-section'

const PRODUCT_LINKS = ['how', 'ask', 'graph', 'capture', 'places', 'pricing', 'faq'] as const

const LEGAL_LINKS = [
    { key: 'terms' as const, href: '#terms' },
    { key: 'privacy' as const, href: '#privacy' },
    { key: 'cookies' as const, href: '#cookies' }
] as const

const linkClass =
    'text-muted-foreground hover:text-foreground text-[13px] leading-snug no-underline transition-colors duration-150'

export const LandingFooter = () => {
    const t = useTranslations('landing')
    const year = new Date().getFullYear()
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()
    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${locale}`), '') || '/'

    const setLocale = (next: 'ru' | 'en') => {
        if (locale === next) return
        router.push(`/${next}${pathWithoutLocale}`)
    }

    return (
        <footer id="terms" className="border-hairline mt-4 border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-14">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <Link
                            href={ROUTES.WELCOME}
                            className="font-brand text-primary text-base font-semibold tracking-tight lowercase no-underline"
                        >
                            {APP_NAME}
                        </Link>
                        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">{t('footer.tagline')}</p>
                        <p className="mt-5">
                            <Link href={ROUTES.REGISTER} className={cn(linkClass, 'text-foreground/85 font-medium')}>
                                {t('footer.startLink')} →
                            </Link>
                        </p>
                    </div>

                    <div className="sm:col-span-1 lg:col-span-2 lg:col-start-7">
                        <p className="text-foreground/70 mb-3 text-sm font-medium">{t('footer.navTitle')}</p>
                        <ul className="space-y-2.5">
                            {PRODUCT_LINKS.map((id) => (
                                <li key={id}>
                                    <LandingSectionLink sectionId={id} className={linkClass}>
                                        {t(`nav.${id}`)}
                                    </LandingSectionLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <p className="text-foreground/70 mb-3 text-sm font-medium">{t('footer.legalTitle')}</p>
                        <ul className="space-y-2.5">
                            {LEGAL_LINKS.map(({ key, href }) => (
                                <li key={key}>
                                    <a
                                        href={href}
                                        className={linkClass}
                                        onClick={(event) => {
                                            const id = href.replace(/^#/, '')
                                            if (id) onLandingSectionAnchorClick(event, id)
                                        }}
                                    >
                                        {t(`footer.legal.${key}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <p className="text-foreground/70 mb-3 text-sm font-medium">{t('footer.supportTitle')}</p>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className={cn(linkClass, 'text-foreground/90 font-medium')}>
                            {SUPPORT_EMAIL}
                        </a>
                        <p className="text-muted-foreground mt-2 max-w-xs text-[13px] leading-relaxed">{t('footer.supportHint')}</p>
                    </div>
                </div>

                <div
                    id="cookies"
                    className="border-hairline text-muted-foreground mt-10 flex flex-col gap-4 border-t pt-6 text-[12px] leading-relaxed sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="text-muted-foreground/90">
                        © {year} {APP_NAME}. {t('footer.rights')}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 sm:justify-end">
                        <span className="text-muted-foreground/50 hidden sm:inline" aria-hidden>
                            ·
                        </span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1" role="group" aria-label={t('footer.languageLabel')}>
                            {(
                                [
                                    { code: 'ru' as const, label: t('footer.langRu') },
                                    { code: 'en' as const, label: t('footer.langEn') }
                                ] as const
                            ).map(({ code, label }, index) => (
                                <span key={code} className="inline-flex items-center gap-3">
                                    {index > 0 && (
                                        <span className="text-muted-foreground/35" aria-hidden>
                                            ·
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setLocale(code)}
                                        className={cn(
                                            'p-0 text-[12px] font-medium transition-colors',
                                            locale === code
                                                ? 'text-foreground cursor-default'
                                                : 'text-muted-foreground hover:text-foreground cursor-pointer'
                                        )}
                                        aria-current={locale === code ? 'true' : undefined}
                                    >
                                        {label}
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
