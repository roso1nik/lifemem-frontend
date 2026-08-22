import type { Metadata } from 'next'
import { AuthCard } from '@/widgets/auth/auth-card'
import { noIndexRobots } from '@/shared/config/seo'

export const metadata: Metadata = {
    robots: noIndexRobots
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-10">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--accent)_80%,transparent)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_color-mix(in_srgb,var(--sage)_20%,transparent)_0%,_transparent_45%)]"
            />
            <div className="relative z-10 flex w-full flex-col items-center">
                <AuthCard>{children}</AuthCard>
            </div>
        </div>
    )
}
