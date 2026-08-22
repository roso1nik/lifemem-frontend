import { MetadataRoute } from 'next'
import { BRAND, SITE_NAME, SITE_SHORT_NAME } from '@/shared/config/site'
import { defaultLocale } from '@/i18n/routing'

export default function manifest(): MetadataRoute.Manifest {
    const startUrl = `/${defaultLocale}`

    return {
        id: '/',
        name: SITE_NAME,
        short_name: SITE_SHORT_NAME,
        description: 'Your life, as notes — with a graph that grows as you save.',
        start_url: startUrl,
        scope: '/',
        display: 'standalone',
        lang: defaultLocale,
        dir: 'ltr',
        orientation: 'any',
        background_color: BRAND.backgroundColor,
        theme_color: BRAND.themeColor,
        categories: ['lifestyle', 'productivity'],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/icon-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ]
    }
}
