import { ProfilePage } from '@/widgets/profile'
import { getAppSectionMetadata } from '@/shared/config/seo'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params
    return getAppSectionMetadata(locale, 'profile')
}

export default function Page() {
    return <ProfilePage />
}
