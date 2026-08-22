import type { Metadata } from 'next'
import { ROUTES } from '@/shared/router'
import { getPublicPageMetadata } from '@/shared/config/seo'
import { LandingPage } from '@/widgets/landing'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    return getPublicPageMetadata({
        locale,
        path: ROUTES.WELCOME,
        titleKey: 'welcomeTitle',
        descriptionKey: 'welcomeDescription'
    })
}

export default function WelcomePage() {
    return <LandingPage />
}
