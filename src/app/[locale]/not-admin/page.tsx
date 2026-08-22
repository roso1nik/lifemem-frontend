import type { Metadata } from 'next'
import { NoAuthPage } from '@/widgets/no-auth'
import { noIndexRobots } from '@/shared/config/seo'

export const metadata: Metadata = {
    robots: noIndexRobots
}

const NotAdminPage = () => <NoAuthPage />

export default NotAdminPage
