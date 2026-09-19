'use client'

import { useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { CtaLink } from './cta-link'
import {
    landingCardClass,
    landingCardHoverClass,
    landingKickerClass,
    landingSectionClass,
    landingSectionInnerClass,
    landingSectionLeadClass,
    landingSectionTitleClass
} from './landing-layout'
import {
    PRICING_MONTHLY_RUB,
    PRICING_PLAN_IDS,
    PRICING_YEARLY_DISCOUNT,
    type PricingPlanId
} from './landing-pricing-plans'
import { Reveal } from './reveal'

const FEATURE_KEYS = ['credits', 'models', 'processing', 'voiceFormat', 'core', 'yearly'] as const
type FeatureKey = (typeof FEATURE_KEYS)[number]

const PLAN_FEATURES: Record<PricingPlanId, readonly FeatureKey[]> = {
    free: ['credits', 'models', 'processing', 'voiceFormat', 'core'],
    pro: ['credits', 'models', 'processing', 'voiceFormat', 'core', 'yearly'],
    max: ['credits', 'models', 'processing', 'voiceFormat', 'core', 'yearly']
}

const MINUS_FEATURES: Record<PricingPlanId, readonly FeatureKey[]> = {
    free: ['voiceFormat'],
    pro: [],
    max: []
}

const tabFocusClass =
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]'

export const LandingPricing = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()
    const [yearly, setYearly] = useState(false)
    const onMonthly = useCallback(() => setYearly(false), [])
    const onYearly = useCallback(() => setYearly(true), [])

    return (
        <section id="pricing" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className={landingKickerClass}>{t('pricing.kicker')}</p>
                    <h2 className={landingSectionTitleClass}>{t('pricing.title')}</h2>
                    <p className={landingSectionLeadClass}>{t('pricing.subtitle')}</p>
                </Reveal>

                <Reveal className="mt-10 flex flex-col items-center gap-3">
                    <div
                        className="bg-muted/70 border-hairline relative inline-flex rounded-full border p-1 shadow-inner"
                        role="tablist"
                        aria-label={t('pricing.billingToggleLabel')}
                    >
                        <span
                            aria-hidden
                            className={cn(
                                'bg-card absolute inset-y-1 rounded-full shadow-sm transition-[left] duration-300 ease-out',
                                reduce && 'transition-none'
                            )}
                            style={{
                                width: 'calc(50% - 4px)',
                                left: yearly ? 'calc(50% + 2px)' : '4px'
                            }}
                        />
                        <button
                            type="button"
                            role="tab"
                            aria-selected={!yearly}
                            onClick={onMonthly}
                            className={cn(
                                'relative z-10 min-w-[7.5rem] rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:min-w-[8.5rem] sm:px-6',
                                tabFocusClass,
                                !yearly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {t('pricing.billingMonthly')}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={yearly}
                            onClick={onYearly}
                            className={cn(
                                'relative z-10 flex min-w-[7.5rem] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:min-w-[8.5rem] sm:px-6',
                                tabFocusClass,
                                yearly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {t('pricing.billingYearly')}
                            <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                                {t('pricing.billingYearlyBadge')}
                            </span>
                        </button>
                    </div>
                    <p className={cn('text-muted-foreground min-h-[1.25rem] text-sm', !yearly && 'invisible')}>
                        {t('pricing.yearlyHint')}
                    </p>
                </Reveal>

                <div className="relative mt-8 md:mt-10">
                    <div
                        className={cn(
                            'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1',
                            '-mx-4 px-4 [scrollbar-width:none] md:mx-0 md:grid md:snap-none md:grid-cols-3 md:items-stretch md:gap-4 md:overflow-visible md:px-0 md:pb-0',
                            '[&::-webkit-scrollbar]:hidden'
                        )}
                    >
                        {PRICING_PLAN_IDS.map((planId, index) => (
                            <Reveal
                                key={planId}
                                delay={index * 0.06}
                                className="w-[min(82vw,300px)] shrink-0 snap-center min-w-0 md:w-auto md:shrink"
                            >
                                <PricingCard planId={planId} recommended={planId === 'pro'} yearly={yearly} />
                            </Reveal>
                        ))}
                    </div>
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--background)] to-transparent md:hidden"
                    />
                    <p className="text-muted-foreground mt-3 text-center text-xs md:hidden">{t('pricing.swipeHint')}</p>
                </div>
            </div>
        </section>
    )
}

type PricingCardProps = {
    planId: PricingPlanId
    recommended: boolean
    yearly: boolean
}

const PricingCard = ({ planId, recommended, yearly }: PricingCardProps) => {
    const t = useTranslations('landing')
    const minusSet = new Set(MINUS_FEATURES[planId])

    const priceLine = (() => {
        if (planId === 'free') {
            return {
                amount: t('pricing.plans.free.price'),
                suffix: t('pricing.perMonth'),
                note: null as string | null
            }
        }
        const monthly = PRICING_MONTHLY_RUB[planId]
        if (yearly) {
            const discountedMonthly = Math.round(monthly * (1 - PRICING_YEARLY_DISCOUNT))
            const yearlyTotal = discountedMonthly * 12
            return {
                amount: t('pricing.priceRub', { value: discountedMonthly }),
                suffix: t('pricing.perMonth'),
                note: t('pricing.billedYearly', { value: yearlyTotal })
            }
        }
        return {
            amount: t('pricing.priceRub', { value: monthly }),
            suffix: t('pricing.perMonth'),
            note: null
        }
    })()

    return (
        <article
            className={cn(
                landingCardClass,
                landingCardHoverClass,
                'flex h-full flex-col p-5',
                recommended &&
                    'ring-primary/40 relative bg-[color-mix(in_srgb,var(--primary)_10%,var(--card))] ring-2 md:scale-[1.02]'
            )}
        >
            {recommended && (
                <span className="bg-primary text-primary-foreground absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-tight whitespace-nowrap shadow-sm">
                    {t('pricing.recommended')}
                </span>
            )}
            <div className="mb-2 min-h-[1.125rem]">
                {planId === 'pro' && (
                    <span className="text-primary inline-flex w-fit rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                        {t('pricing.plans.pro.highlight')}
                    </span>
                )}
                {planId === 'max' && (
                    <span className="text-sage inline-flex w-fit rounded-full bg-[color-mix(in_srgb,var(--sage)_18%,transparent)] px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                        {t('pricing.plans.max.highlight')}
                    </span>
                )}
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{t(`pricing.plans.${planId}.name`)}</h3>
            <p className="text-muted-foreground mt-1 text-sm">{t(`pricing.plans.${planId}.tagline`)}</p>
            <div className="mt-4 min-h-[4.75rem]">
                <p className="text-3xl font-semibold tracking-tight tabular-nums">
                    {priceLine.amount}
                    <span className="text-muted-foreground text-sm font-normal">{priceLine.suffix}</span>
                </p>
                <p
                    className={cn(
                        'text-muted-foreground mt-1 min-h-[2.5rem] text-xs leading-relaxed',
                        !priceLine.note && 'invisible'
                    )}
                >
                    {priceLine.note ?? t('pricing.billedYearlyPlaceholder')}
                </p>
            </div>

            <ul className="mt-4 flex flex-1 flex-col gap-3">
                {PLAN_FEATURES[planId].map((key) => {
                    const isMinus = minusSet.has(key)
                    return (
                        <li key={key} className="flex gap-2.5 text-sm leading-snug">
                            {isMinus ? (
                                <Minus size={16} className="text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
                            ) : (
                                <Check size={16} className="text-sage mt-0.5 shrink-0" strokeWidth={1.75} />
                            )}
                            <span className={cn(isMinus && 'text-muted-foreground')}>
                                {t(`pricing.plans.${planId}.features.${key}`)}
                            </span>
                        </li>
                    )
                })}
            </ul>

            <CtaLink
                href={ROUTES.REGISTER}
                variant={recommended ? 'filled' : 'subtle'}
                size="md"
                className="mt-6 w-full"
            >
                {t(`pricing.plans.${planId}.cta`)}
            </CtaLink>
        </article>
    )
}
