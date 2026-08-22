import type { Metadata } from 'next'
import { noIndexRobots } from '@/shared/config/seo'
import AdminShell from './admin-shell'

export const metadata: Metadata = {
    robots: noIndexRobots
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell>{children}</AdminShell>
}
