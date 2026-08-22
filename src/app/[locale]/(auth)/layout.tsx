import { AuthCard } from '@/widgets/auth/auth-card'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-10">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ddeef7_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#b8dced33_0%,_transparent_45%)] dark:bg-[radial-gradient(ellipse_at_top,_#1e2a35_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#2f729333_0%,_transparent_45%)]"
            />
            <div className="relative z-10 flex w-full flex-col items-center">
                <AuthCard>{children}</AuthCard>
            </div>
        </div>
    )
}
