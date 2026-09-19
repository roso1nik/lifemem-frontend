export const PRICING_PLAN_IDS = ['free', 'pro', 'max'] as const
export type PricingPlanId = (typeof PRICING_PLAN_IDS)[number]

export const PRICING_CREDITS: Record<PricingPlanId, number> = {
    free: 300,
    pro: 3000,
    max: 12000
}

export const PRICING_MONTHLY_RUB: Record<'pro' | 'max', number> = {
    pro: 299,
    max: 899
}

export const PRICING_YEARLY_DISCOUNT = 0.3
