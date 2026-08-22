'use client'

import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { CtaLink } from './cta-link'
import { Reveal } from './reveal'

export const LandingClose = () => {
    const t = useTranslations('landing')

    return (
        <>
            <section id="privacy" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 md:px-6 md:py-28">
                <Reveal>
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">{t('privacy.title')}</h2>
                    <p className="text-muted-foreground mt-4 max-w-[46ch] text-base leading-relaxed md:text-lg">
                        {t('privacy.body')}
                    </p>
                </Reveal>
                <Reveal>
                    <div className="border-hairline mt-12 grid gap-8 border-t pt-10 sm:grid-cols-2 sm:gap-10">
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">{t('privacy.indexTitle')}</h3>
                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
                                {t('privacy.indexBody')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight">{t('privacy.leaveTitle')}</h3>
                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
                                {t('privacy.leaveBody')}
                            </p>
                        </div>
                    </div>
                </Reveal>
            </section>

            <section className="border-hairline border-t py-16 md:py-20">
                <Reveal className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 md:flex-row md:items-end md:justify-between md:px-6">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('cta.title')}</h2>
                        <p className="text-muted-foreground mt-3 max-w-[36ch] text-base">{t('cta.body')}</p>
                    </div>
                    <CtaLink href={ROUTES.REGISTER} size="lg">
                        {t('getStarted')}
                    </CtaLink>
                </Reveal>
            </section>
        </>
    )
}
