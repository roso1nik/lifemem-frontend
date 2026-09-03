import type { Metadata } from 'next'
import { MainShell } from '@/widgets/main-shell'
import { noIndexRobots } from '@/shared/config/seo'
import { AuthGuard } from '@/features/auth-guard'

export const metadata: Metadata = {
    robots: noIndexRobots
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <MainShell>{children}</MainShell>
        </AuthGuard>
    )
}
