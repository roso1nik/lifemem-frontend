import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: ['ru', 'en'],
    defaultLocale: 'en',
    // локализованные пути для все языков
    // pathnames: {
    //     '/': '/',
    //     '/login': '/login',
    //     '/pathnames': {
    //         en: '/pathnames',
            
    //     }
    // }
})

export const locales = routing.locales
export const defaultLocale = routing.defaultLocale

export const removeLocalePrefix = (urlPath: string): string => {
    // Only strip known app locales — a naive /[a-z]{2,3}/ would turn `/map` into `/`.
    const match = urlPath.match(/^\/([^/]+)(\/.*)?$/)
    if (!match) return urlPath || '/'
    const [, maybeLocale, rest = ''] = match
    if (!(locales as readonly string[]).includes(maybeLocale)) return urlPath
    return rest === '' ? '/' : rest
}
