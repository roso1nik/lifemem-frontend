import { SectionPlaceholder } from '@/widgets/section-placeholder'
import { getAppSectionMetadata } from '@/shared/config/seo'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params
    return getAppSectionMetadata(locale, 'archive')
}

export default function ArchivePage() {
    return <SectionPlaceholder section="archive" />
}
