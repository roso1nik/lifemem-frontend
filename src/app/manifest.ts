import { ROUTES } from '@/shared/router'
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'GHUB',
        short_name: 'GHUB',
        description: 'GHUB',
        start_url: ROUTES.HOME_PAGE,
        display: 'fullscreen',
        background_color: '#0e0e12',
        theme_color: '#9b57ff',
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
