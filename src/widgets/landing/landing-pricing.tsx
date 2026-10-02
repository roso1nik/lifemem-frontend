'use client'

import { useCallback, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Check, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ROUTES } from '@/shared/router'
import { cn } from '@/shared/utils'
import { CtaLink } from './cta-link'
import { LandingCreditsNote } from './landing-credits-note'
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

const OUTCOME_KEYS = ['credits', 'core', 'voiceFormat', 'processing'] as const
const TECH_KEYS = ['models', 'yearly'] as const
type OutcomeKey = (typeof OUTCOME_KEYS)[number]
type TechKey = (typeof TECH_KEYS)[number]

const MINUS_FEATURES: Record<PricingPlanId, readonly OutcomeKey[]> = {
    free: ['voiceFormat'],
    pro: [],
    max: []
}

const tabFocusClass =
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]'

const planTabClass = (active: boolean) =>
    cn(
        'relative z-10 rounded-full px-2 py-2.5 text-sm transition-colors sm:px-3',
        tabFocusClass,
        active ? 'text-foreground font-semibold' : 'text-muted-foreground font-medium hover:text-foreground'
    )

const sliderClass = (reduce: boolean) =>
    cn(
        'bg-card pointer-events-none absolute inset-y-1 rounded-full shadow-sm ring-1 ring-primary/25',
        reduce && 'transition-none',
        !reduce && 'transition-[left] duration-300 ease-out'
    )

export const LandingPricing = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()
    const [yearly, setYearly] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<PricingPlanId>('pro')
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
                        className="bg-muted/70 border-hairline relative grid w-full max-w-sm grid-cols-2 rounded-full border p-1 shadow-inner"
                        role="tablist"
                        aria-label={t('pricing.billingToggleLabel')}
                    >
                        <span
                            aria-hidden
                            className={sliderClass(Boolean(reduce))}
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
                            className={cn(planTabClass(!yearly), 'text-center')}
                        >
                            {t('pricing.billingMonthly')}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={yearly}
                            onClick={onYearly}
                            className={cn(planTabClass(yearly), 'flex flex-col items-center justify-center gap-0.5 text-center')}
                        >
                            <span>{t('pricing.billingYearly')}</span>
                            <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                                {t('pricing.billingYearlyBadge')}
                            </span>
                        </button>
                    </div>
                    <p className={cn('text-muted-foreground min-h-[1.25rem] text-sm', !yearly && 'invisible')}>
                        {t('pricing.yearlyHint')}
                    </p>
                </Reveal>

                <Reveal className="mt-8 flex flex-col items-center md:mt-10 md:hidden">
                    <div
                        className="bg-muted/70 border-hairline relative grid w-full max-w-md grid-cols-3 rounded-full border p-1 shadow-inner"
                        role="tablist"
                        aria-label={t('pricing.planToggleLabel')}
                    >
                        <span
                            aria-hidden
                            className={sliderClass(Boolean(reduce))}
                            style={{
                                width: 'calc(33.333% - 4px)',
                                left:
                                    selectedPlan === 'free'
                                        ? '4px'
                                        : selectedPlan === 'pro'
                                          ? 'calc(33.333% + 2px)'
                                          : 'calc(66.666% + 0px)'
                            }}
                        />
                        {PRICING_PLAN_IDS.map((planId) => (
                            <button
                                key={planId}
                                type="button"
                                role="tab"
                                aria-selected={selectedPlan === planId}
                                onClick={() => setSelectedPlan(planId)}
                                className={cn(planTabClass(selectedPlan === planId), 'text-center')}
                            >
                                {t(`pricing.plans.${planId}.name`)}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 w-full max-w-md">
                        <PricingCard planId={selectedPlan} recommended={selectedPlan === 'pro'} yearly={yearly} />
                    </div>

                </Reveal>

                <div className="mt-10 hidden w-full gap-4 md:grid md:grid-cols-3 md:items-stretch">
                    {PRICING_PLAN_IDS.map((planId, index) => (
                        <Reveal key={planId} delay={index * 0.06} className="min-w-0">
                            <PricingCard planId={planId} recommended={planId === 'pro'} yearly={yearly} />
                        </Reveal>
                    ))}
                </div>

                <LandingCreditsNote />
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
                {OUTCOME_KEYS.map((key) => {
                    const isMinus = minusSet.has(key)
                    return (
                        <li key={key} className="flex gap-2.5 text-sm leading-snug">
                            {isMinus ? (
                                <Minus size={16} className="text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.75} />
                            ) : (
                                <Check size={16} className="text-sage mt-0.5 shrink-0" strokeWidth={1.75} />
                            )}
                            <span className={cn(isMinus && 'text-muted-foreground')}>
                                {t(`pricing.plans.${planId}.featuresOutcome.${key}`)}
                            </span>
                        </li>
                    )
                })}
            </ul>

            <div className="border-hairline mt-4 border-t pt-4">
                <p className="text-muted-foreground text-xs font-semibold tracking-tight uppercase">{t('pricing.allLimits')}</p>
                <ul className="mt-2 flex flex-col gap-2">
                    {TECH_KEYS.map((key: TechKey) => (
                        <li key={key} className="text-muted-foreground text-xs leading-snug">
                            {t(`pricing.plans.${planId}.featuresTechnical.${key}`)}
                        </li>
                    ))}
                </ul>
            </div>

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
