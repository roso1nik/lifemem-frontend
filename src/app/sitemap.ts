import { MetadataRoute } from 'next'
import { getPathname } from '@/i18n/navigation'
import { defaultLocale, locales } from '@/i18n/routing'
import { getSiteUrl, INDEXABLE_PATHS } from '@/shared/config/site'

type Path = (typeof INDEXABLE_PATHS)[number]

const getUrl = (href: Path, locale: (typeof locales)[number]) => {
    const pathname = getPathname({ locale, href })
    return `${getSiteUrl()}${pathname}`
}

const languageAlternates = (href: Path) => {
    const languages: Record<string, string> = {
        'x-default': getUrl(href, defaultLocale)
    }

    for (const locale of locales) {
        languages[locale] = getUrl(href, locale)
    }

    return languages
}

export default function sitemap(): MetadataRoute.Sitemap {
    return INDEXABLE_PATHS.flatMap((href) =>
        locales.map((locale) => ({
            url: getUrl(href, locale),
            alternates: {
                languages: languageAlternates(href)
            }
        }))
    )
}
