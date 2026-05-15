import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '../../shared/styles/index.css'
import { cn } from '@/shared/utils'
import { QueryProvider } from '@/shared/providers/query-client'
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core'
import { theme } from '@/shared/styles/theme'
import { ThemeProvider } from '@/shared/providers/theme-provider'
import { Toaster } from 'react-hot-toast'
import { locales } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

const font_flobal = Inter({
    variable: '--font',
    subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext']
})

export const metadata: Metadata = {
    title: 'Gravitino Code Admin',
    description: 'Gravitino Code Admin Panel',
    // TODO: icons
    icons: {
        icon: '/images/ss-logo-black.svg',
        shortcut: '/images/ss-logo-black.svg',
        apple: '/images/ss-logo-black.svg'
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
                    <MantineProvider theme={theme}>
                        <ThemeProvider>
                            <QueryProvider>
                                {children}
                                <Toaster />
                            </QueryProvider>
                        </ThemeProvider>
                    </MantineProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
