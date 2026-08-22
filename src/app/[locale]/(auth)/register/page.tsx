import type { Metadata } from 'next'
import RegisterForm from '@/features/register'
import { ROUTES } from '@/shared/router'
import { getPublicPageMetadata } from '@/shared/config/seo'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    return getPublicPageMetadata({
        locale,
        path: ROUTES.REGISTER,
        titleKey: 'registerTitle',
        descriptionKey: 'registerDescription'
    })
}

const RegisterPage = () => {
    return <RegisterForm />
}

export default RegisterPage
