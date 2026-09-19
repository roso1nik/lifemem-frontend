import { cn } from '@/shared/utils'
import { landingScrollMarginClass } from './landing-scroll'

/** Shared section rhythm (after hero): top rule + vertical padding + anchor offset. */
export const landingSectionClass = cn('border-hairline border-t py-16 md:py-24', landingScrollMarginClass)

export const landingSectionInnerClass = 'mx-auto max-w-7xl px-4 md:px-6'

export const landingKickerClass = 'text-primary text-sm font-medium tracking-tight'

export const landingSectionTitleClass =
    'mt-2 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl'

export const landingSectionLeadClass = 'text-muted-foreground mt-3 text-base leading-relaxed'

/** Static content cards on the landing (demos use `Surface frost`). */
export const landingCardClass =
    'border-hairline bg-card/75 rounded-[var(--radius-card)] border transition-colors duration-200'

export const landingCardHoverClass = 'hover:-translate-y-0.5 hover:border-primary/35'

export const landingIconWellClass =
    'bg-accent/80 text-primary flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-card)]'
