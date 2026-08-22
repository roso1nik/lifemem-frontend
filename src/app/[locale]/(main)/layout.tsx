import type { Metadata } from 'next'
import { MainShell } from '@/widgets/main-shell'
import { noIndexRobots } from '@/shared/config/seo'

export const metadata: Metadata = {
    robots: noIndexRobots
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return <MainShell>{children}</MainShell>
}
