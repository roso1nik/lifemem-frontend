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
    const pathWithoutLocale = urlPath.replace(/^\/[a-z]{2,3}(\/|$)/, '/')
    return pathWithoutLocale === '' ? '/' : pathWithoutLocale
}
