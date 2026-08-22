import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import {
    absoluteUrl,
    BRAND,
    defaultLocale,
    getSiteUrl,
    locales,
    localizedPath,
    OG_LOCALES,
    SITE_NAME
} from './site'

export const noIndexRobots: Metadata['robots'] = {
    index: false,
    follow: false,
    googleBot: {
        index: false,
        follow: false
    }
}

export const publicRobots: Metadata['robots'] = {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1
    }
}

export function localeAlternates(path: string, locale: string): Metadata['alternates'] {
    const languages: Record<string, string> = {
        'x-default': localizedPath(path, defaultLocale)
    }

    for (const item of locales) {
        languages[item] = localizedPath(path, item)
    }

    return {
        canonical: localizedPath(path, locale),
        languages
    }
}

export async function getPublicPageMetadata({
    locale,
    path,
    titleKey,
    descriptionKey
}: {
    locale: string
    path: string
    titleKey?: 'loginTitle' | 'registerTitle'
    descriptionKey?: 'loginDescription' | 'registerDescription'
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'seo' })
    const title = titleKey ? t(titleKey) : t('title')
    const description = descriptionKey ? t(descriptionKey) : t('description')
    const ogLocale = OG_LOCALES[locale as keyof typeof OG_LOCALES] ?? OG_LOCALES.en
    const alternateLocale = locales
        .filter((item) => item !== locale)
        .map((item) => OG_LOCALES[item])

    return {
        title: titleKey ? title : { absolute: title },
        description,
        alternates: localeAlternates(path, locale),
        robots: publicRobots,
        openGraph: {
            type: 'website',
            url: absoluteUrl(path, locale),
            title: titleKey ? title : t('ogTitle'),
            description: titleKey ? description : t('ogDescription'),
            locale: ogLocale,
            alternateLocale,
            siteName: t('appName'),
            images: [
                {
                    url: localizedPath('/opengraph-image', locale),
                    width: 1200,
                    height: 675,
                    alt: t('appName')
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: titleKey ? title : t('ogTitle'),
            description: titleKey ? description : t('ogDescription')
        }
    }
}

export async function getAppSectionMetadata(
    locale: string,
    tab: 'graph' | 'map' | 'profile' | 'archive'
): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'home' })
    return { title: t(`tab.${tab}`) }
}

export async function getWebAppJsonLd(locale: string) {
    const t = await getTranslations({ locale, namespace: 'seo' })

    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: SITE_NAME,
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        url: getSiteUrl(),
        inLanguage: [...locales],
        description: t('description'),
        image: `${getSiteUrl()}/icon-512.png`,
        brand: {
            '@type': 'Brand',
            name: SITE_NAME
        }
    }
}

export const themeColorEntries = [
    { media: '(prefers-color-scheme: light)', color: BRAND.themeColor },
    { media: '(prefers-color-scheme: dark)', color: BRAND.themeColorDark }
] as const
