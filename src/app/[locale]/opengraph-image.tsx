import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { OpenGraphGraphic } from '@/shared/lib/brand-graphics'

export const alt = 'Lifemem'
export const size = { width: 1200, height: 675 }
export const contentType = 'image/png'

type ImageProps = {
    params: Promise<{ locale: string }>
}

export default async function Image({ params }: ImageProps) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'seo' })
    const fontsDir = join(process.cwd(), 'public/fonts')

    const [latin, cyrillic] = await Promise.all([
        readFile(join(fontsDir, 'inter-latin-600.ttf')),
        readFile(join(fontsDir, 'inter-cyrillic-600.ttf'))
    ])

    return new ImageResponse(<OpenGraphGraphic tagline={t('ogDescription')} />, {
        ...size,
        fonts: [
            { name: 'Inter', data: latin, weight: 600, style: 'normal' },
            { name: 'Inter', data: cyrillic, weight: 600, style: 'normal' }
        ]
    })
}
