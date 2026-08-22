'use client'

import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { CtaLink } from './cta-link'
import { Reveal } from './reveal'

export const LandingClose = () => {
    const t = useTranslations('landing')

    return (
        <>
            <section id="privacy" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-24 md:px-6 md:py-32">
                <Reveal>
                    <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{t('privacy.title')}</h2>
                    <p className="text-muted-foreground mt-4 max-w-[46ch] text-base leading-relaxed md:text-lg">
                        {t('privacy.body')}
                    </p>
                </Reveal>
                <Reveal>
                    <div className="border-hairline mt-12 space-y-10 border-t pt-10">
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight">{t('privacy.indexTitle')}</h3>
                            <p className="text-muted-foreground mt-2 max-w-[46ch] text-base leading-relaxed">
                                {t('privacy.indexBody')}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold tracking-tight">{t('privacy.leaveTitle')}</h3>
                            <p className="text-muted-foreground mt-2 max-w-[46ch] text-base leading-relaxed">
                                {t('privacy.leaveBody')}
                            </p>
                        </div>
                    </div>
                </Reveal>
            </section>

            <section className="border-hairline border-t py-20 md:py-24">
                <Reveal className="mx-auto max-w-7xl px-4 md:px-6">
                    <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('cta.title')}</h2>
                    <p className="text-muted-foreground mt-3 max-w-[36ch] text-base">{t('cta.body')}</p>
                    <div className="mt-6">
                        <CtaLink href={ROUTES.REGISTER} size="lg">
                            {t('getStarted')}
                        </CtaLink>
                    </div>
                </Reveal>
            </section>
        </>
    )
}
