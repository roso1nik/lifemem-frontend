import type { Metadata } from 'next'
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
import { setRequestLocale } from 'next-intl/server'
import { APP_CONFIG } from '@/shared/config'

const font_flobal = Inter({
    variable: '--font',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext']
})

export const metadata: Metadata = {
    title: APP_CONFIG.NAME,
    description: APP_CONFIG.DESCRIPTION,
    icons: {
        icon: '/favicon.ico'
    }
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
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

    return (
        <html lang={locale} {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body className={cn(`antialiased`, font_flobal.variable)}>
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
