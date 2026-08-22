import { getTranslations } from 'next-intl/server'
import { LandingFooter, LandingNav } from '@/widgets/landing'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('landing')

    return (
        <div className="bg-background text-foreground min-h-[100dvh]">
            <a
                href="#main"
                className="bg-primary text-primary-foreground focus:rounded-[var(--radius-button)] sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2"
            >
                {t('skip')}
            </a>
            <LandingNav />
            <main id="main">{children}</main>
            <LandingFooter />
        </div>
    )
}
