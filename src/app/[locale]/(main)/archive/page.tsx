import { ArchivePage } from '@/widgets/archive'
import { getAppSectionMetadata } from '@/shared/config/seo'

type PageProps = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { locale } = await params
    return getAppSectionMetadata(locale, 'archive')
}

export default function Page() {
    return <ArchivePage />
}
