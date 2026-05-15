import { AuthCard } from '@/widgets/auth/auth-card'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="via-background flex min-h-screen w-full flex-col items-center justify-center gap-0 bg-linear-to-br from-[#f9d648]/10 to-[#f9d648]/10 px-2">
            <AuthCard>{children}</AuthCard>
        </div>
    )
}
