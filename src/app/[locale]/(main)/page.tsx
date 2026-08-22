import type { Metadata } from 'next'
import { ROUTES } from '@/shared/router'
import { getPublicPageMetadata } from '@/shared/config/seo'
import HomePage from './home-page'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    return getPublicPageMetadata({ locale, path: ROUTES.HOME_PAGE })
}

export default function Page() {
    return <HomePage />
}
