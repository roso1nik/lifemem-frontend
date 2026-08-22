import type { Metadata } from 'next'
import LoginForm from '@/features/login'
import { ROUTES } from '@/shared/router'
import { getPublicPageMetadata } from '@/shared/config/seo'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    return getPublicPageMetadata({
        locale,
        path: ROUTES.LOGIN,
        titleKey: 'loginTitle',
        descriptionKey: 'loginDescription'
    })
}

const LoginPage = () => {
    return <LoginForm />
}

export default LoginPage
