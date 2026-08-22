import { SectionPlaceholder } from '@/widgets/section-placeholder'
import { getAppSectionMetadata } from '@/shared/config/seo'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params
    return getAppSectionMetadata(locale, 'map')
}

export default function MapPage() {
    return <SectionPlaceholder section="map" />
}
