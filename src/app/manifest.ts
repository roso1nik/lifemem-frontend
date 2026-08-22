import { APP_CONFIG } from '@/shared/config'
import { ROUTES } from '@/shared/router'
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: APP_CONFIG.NAME,
        short_name: APP_CONFIG.NAME,
        description: APP_CONFIG.DESCRIPTION,
        start_url: ROUTES.HOME_PAGE,
        display: 'fullscreen',
        background_color: 'var(--background)',
        theme_color: 'var(--primary)',
        orientation: 'any',
        icons: [
            {
                purpose: 'maskable',
                sizes: '512x512',
                src: '/images/app/icon512_maskable.png',
                type: 'image/png'
            },
            {
                purpose: 'any',
                sizes: '512x512',
                src: '/images/app/icon512_rounded.png',
                type: 'image/png'
            }
        ]
    }
}
