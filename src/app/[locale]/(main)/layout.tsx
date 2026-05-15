'use client'

import { CheckAuthProvider } from '@/widgets/check-auth'
import { Header } from '@/widgets/header'

import { Sidebar } from '@/widgets/sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-row gap-0">
            <section className="border-border bg-sidebar sticky top-0 hidden min-h-screen w-[15%] flex-col gap-3 self-start border-r lg:flex">
                <Sidebar />
            </section>
            <div className="bg-background flex w-full flex-col gap-3 lg:w-[85%]">
                <Header />
                <main className="p-8">{children}</main>
            </div>
        </div>
    )
}
