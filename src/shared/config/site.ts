import { defaultLocale, locales } from '@/i18n/routing'
import { ROUTES } from '@/shared/router'

export const SITE_NAME = 'Lifemem'
export const SITE_SHORT_NAME = 'lifemem'

export const BRAND = {
    themeColor: '#5B9FB0',
    themeColorDark: '#7BB8C6',
    backgroundColor: '#F3F7F6',
    backgroundColorDark: '#0E1514',
    sage: '#7FA892',
    foreground: '#1A2422'
} as const

export const OG_LOCALES: Record<(typeof locales)[number], string> = {
    en: 'en_US',
    ru: 'ru_RU'
}

export const INDEXABLE_PATHS = [ROUTES.HOME_PAGE, ROUTES.WELCOME, ROUTES.LOGIN, ROUTES.REGISTER] as const

const LOCALE_AGNOSTIC_DISALLOW = ['/api/'] as const

export const ROBOTS_DISALLOW_PATHS = [
    ...LOCALE_AGNOSTIC_DISALLOW,
    ROUTES.ADMIN,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_SETTINGS,
    ROUTES.ADMIN_MODELS,
    ROUTES.ADMIN_LOGS,
    ROUTES.ADMIN_AUTH_LOGS,
    ROUTES.ADMIN_HEALTH,
    `${ROUTES.NOTE('')}`,
    ROUTES.PROFILE,
    ROUTES.ARCHIVE,
    ROUTES.GRAPH,
    ROUTES.MAP,
    ROUTES.CONFIRM_PAGE,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.NOT_ADMIN
] as const

export function getSiteUrl(): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (fromEnv) return fromEnv

    const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, '')
    if (production) return `https://${production}`

    const vercel = process.env.VERCEL_URL?.replace(/\/$/, '')
    if (vercel) return `https://${vercel}`

    return 'http://localhost:3000'
}

export function localizedPath(path: string, locale: string): string {
    const suffix = path === '/' ? '' : path
    return `/${locale}${suffix}`
}

export function absoluteUrl(path: string, locale: string): string {
    return `${getSiteUrl()}${localizedPath(path, locale)}`
}

export function robotsDisallowPaths(): string[] {
    const paths: string[] = []

    for (const path of ROBOTS_DISALLOW_PATHS) {
        paths.push(path)
        if ((LOCALE_AGNOSTIC_DISALLOW as readonly string[]).includes(path)) continue
        for (const locale of locales) {
            paths.push(`/${locale}${path}`)
        }
    }

    return paths
}

export { defaultLocale, locales }
