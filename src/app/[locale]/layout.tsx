import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/spotlight/styles.css'
import '../../shared/styles/index.css'
import { cn } from '@/shared/utils'
import { QueryProvider } from '@/shared/providers/query-client'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import { MantineAppProvider } from '@/shared/providers/mantine-provider'
import { ThemeProvider } from '@/shared/providers/theme-provider'
import { Toaster } from 'react-hot-toast'
import { locales } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSiteUrl, SITE_NAME } from '@/shared/config/site'
import { getWebAppJsonLd, themeColorEntries } from '@/shared/config/seo'

const font_flobal = Inter({
    variable: '--font',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext']
})

type LocaleLayoutProps = Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [...themeColorEntries]
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo' })
    const siteUrl = getSiteUrl()

    return {
        metadataBase: new URL(siteUrl),
        applicationName: t('appName'),
        title: {
            default: t('title'),
            template: t('titleTemplate')
        },
        description: t('description'),
        category: 'productivity',
        icons: {
            icon: [
                { url: '/favicon.svg', type: 'image/svg+xml' },
                { url: '/favicon.ico', sizes: '32x32' }
            ],
            apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
        },
        manifest: '/manifest.webmanifest',
        openGraph: {
            type: 'website',
            siteName: t('appName'),
            locale: locale === 'ru' ? 'ru_RU' : 'en_US'
        },
        twitter: {
            card: 'summary_large_image'
        },
        appleWebApp: {
            capable: true,
            title: SITE_NAME,
            statusBarStyle: 'default'
        },
        formatDetection: {
            telephone: false,
            email: false,
            address: false
        }
    }
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params
    if (!hasLocale(locales, locale)) {
        notFound()
    }

    let messages
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default
    } catch {
        notFound()
    }

    setRequestLocale(locale)
    const jsonLd = await getWebAppJsonLd(locale)

    return (
        <html lang={locale} {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body className={cn(`antialiased`, font_flobal.variable)}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <MantineAppProvider>
                        <ThemeProvider>
                            <QueryProvider>
                                {children}
                                <Toaster />
                            </QueryProvider>
                        </ThemeProvider>
                    </MantineAppProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
