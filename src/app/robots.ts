import { MetadataRoute } from 'next'
import { getSiteUrl, robotsDisallowPaths } from '@/shared/config/site'

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl()

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: robotsDisallowPaths()
            },
            {
                userAgent: [
                    'GPTBot',
                    'Google-Extended',
                    'Applebot-Extended',
                    'ClaudeBot',
                    'anthropic-ai',
                    'CCBot',
                    'Bytespider'
                ],
                disallow: '/'
            }
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl
    }
}
