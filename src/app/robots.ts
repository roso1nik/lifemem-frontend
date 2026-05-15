import { locales } from '@/i18n/routing'
import { ADMIN_ROUTES } from '@/shared/router'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const disallowedPaths = [...ADMIN_ROUTES, '/api', '/_next', '/_error']

    const allDisallowedPaths: string[] = []
    disallowedPaths.forEach((path) => {
        locales.forEach((locale) => {
            allDisallowedPaths.push(`/${locale}${path}`)
        })
        allDisallowedPaths.push(path)
    })

    return {
        rules: [{ userAgent: '*', allow: '*', disallow: [...allDisallowedPaths] }]
    }
}
