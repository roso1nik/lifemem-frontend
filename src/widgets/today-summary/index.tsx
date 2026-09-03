'use client'

import { useTodayEntriesCount } from '@/entities/entry/api/use-entries'
import { dayjsInstance, cn } from '@/shared/utils'
import { Surface } from '@/shared/ui'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GitBranch, Lightbulb, MapPinned, Network, Sparkles } from 'lucide-react'

const insights = [
    {
        key: 'links',
        Icon: GitBranch,
        tone: 'aqua' as const
    },
    {
        key: 'fact',
        Icon: Lightbulb,
        tone: 'sage' as const
    },
    {
        key: 'graph',
        Icon: Network,
        tone: 'aqua' as const
    },
    {
        key: 'places',
        Icon: MapPinned,
        tone: 'sage' as const
    }
] as const

export const TodaySummary = () => {
    const t = useTranslations('home')
    const count = useTodayEntriesCount()
    const today = dayjsInstance()

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="flex flex-col gap-6 px-1 pb-4"
        >
            <header>
                <p className="text-muted-foreground text-sm capitalize">{today.format('dddd')}</p>
                <h1 className="mt-0.5 text-3xl font-semibold tracking-tight md:text-4xl">{today.format('D MMMM')}</h1>
                <p className="text-sage mt-2 text-sm font-medium">{t('notesToday', { count })}</p>
                {count === 0 && <p className="text-muted-foreground mt-1 text-sm">{t('emptyDay')}</p>}
            </header>

            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        <h2 className="text-sm font-semibold tracking-tight">{t('insightsTitle')}</h2>
                    </div>
                </div>

                <Surface frost className="overflow-hidden p-1">
                    <ul className="divide-hairline flex flex-col divide-y">
                        {insights.map(({ key, Icon, tone }, i) => (
                            <motion.li
                                key={key}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    type: 'spring',
                                    bounce: 0,
                                    duration: 0.35,
                                    delay: 0.06 + i * 0.04
                                }}
                            >
                                <button
                                    type="button"
                                    className="hover:bg-muted/50 flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors active:scale-[0.99]"
                                >
                                    <span
                                        className={cn(
                                            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
                                            tone === 'aqua' ? 'bg-accent text-primary' : 'bg-muted text-sage'
                                        )}
                                    >
                                        <Icon size={16} strokeWidth={2} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[14px] font-medium tracking-tight">
                                            {t(`insight.${key}.title`)}
                                        </span>
                                        <span className="text-muted-foreground mt-0.5 block text-[13px] leading-snug">
                                            {t(`insight.${key}.body`)}
                                        </span>
                                    </span>
                                </button>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="border-hairline mx-3 mt-1 mb-3 overflow-hidden rounded-xl border bg-[color-mix(in_srgb,var(--background)_55%,transparent)] px-4 py-3">
                        <p className="text-muted-foreground mb-3 text-[11px] font-medium tracking-wide uppercase">
                            {t('insightGraphPreview')}
                        </p>
                        <svg viewBox="0 0 280 72" className="text-primary h-14 w-full" aria-hidden fill="none">
                            <circle cx="40" cy="36" r="10" className="fill-accent stroke-primary" strokeWidth="1.5" />
                            <circle cx="120" cy="18" r="8" className="fill-muted stroke-sage" strokeWidth="1.5" />
                            <circle cx="150" cy="52" r="9" className="fill-accent stroke-primary" strokeWidth="1.5" />
                            <circle cx="220" cy="28" r="11" className="fill-muted stroke-sage" strokeWidth="1.5" />
                            <circle cx="250" cy="54" r="7" className="fill-accent stroke-primary" strokeWidth="1.5" />
                            <path
                                d="M50 36 H110 M48 32 L112 22 M48 40 L141 48 M159 48 L211 32 M229 32 L244 48"
                                className="stroke-primary/35"
                                strokeWidth="1.25"
                            />
                        </svg>
                    </div>
                </Surface>
            </section>
        </motion.div>
    )
}
