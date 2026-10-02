'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { GitBranch, Lightbulb, MapPinned, Network, Sparkles } from 'lucide-react'
import { useSearchEntries } from '@/entities/entry/api/use-search-entries'
import { dayjsInstance, cn } from '@/shared/utils'

const insights = [
    { key: 'links', Icon: GitBranch, tone: 'aqua' as const },
    { key: 'fact', Icon: Lightbulb, tone: 'sage' as const },
    { key: 'graph', Icon: Network, tone: 'aqua' as const },
    { key: 'places', Icon: MapPinned, tone: 'sage' as const }
] as const

export const TodaySummary = () => {
    const t = useTranslations('home')
    const { data } = useSearchEntries()
    const today = dayjsInstance()

    const count = useMemo(
        () =>
            (data?.data ?? []).filter((entry) =>
                dayjsInstance(entry.createdAt).isSame(dayjsInstance(), 'day')
            ).length,
        [data]
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="flex flex-col gap-5 pb-2"
        >
            <div className="relative overflow-hidden rounded-[24px]">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 90% 80% at 8% -10%, color-mix(in srgb, var(--primary) 26%, transparent), transparent 55%),
                            radial-gradient(ellipse 70% 60% at 92% 8%, color-mix(in srgb, var(--sage) 18%, transparent), transparent 50%),
                            linear-gradient(165deg,
                                color-mix(in srgb, var(--card) 65%, transparent),
                                color-mix(in srgb, var(--background) 45%, transparent)
                            )
                        `
                    }}
                />
                <div className="border-hairline bg-surface-frost/35 relative border px-5 py-6 backdrop-blur-xl sm:px-6 sm:py-7">
                    <p className="text-muted-foreground text-sm capitalize">{today.format('dddd')}</p>
                    <h1 className="mt-1 text-[2rem] leading-none font-semibold tracking-tight sm:text-4xl">
                        {today.format('D MMMM')}
                    </h1>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="bg-primary/12 text-primary inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
                            {t('notesToday', { count })}
                        </span>
                        {count === 0 && (
                            <p className="text-muted-foreground text-sm leading-relaxed">{t('emptyDay')}</p>
                        )}
                    </div>
                </div>
            </div>

            <section className="flex flex-col gap-3 px-0.5">
                <div className="flex items-center gap-2 px-0.5">
                    <Sparkles size={14} className="text-primary" />
                    <h2 className="text-sm font-semibold tracking-tight">{t('insightsTitle')}</h2>
                    <span className="bg-muted text-muted-foreground ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase">
                        {t('insightsSoon')}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {insights.map(({ key, Icon, tone }, i) => (
                        <motion.button
                            key={key}
                            type="button"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: 'spring',
                                bounce: 0,
                                duration: 0.35,
                                delay: 0.04 + i * 0.04
                            }}
                            className={cn(
                                'border-hairline bg-surface-frost/50 flex flex-col gap-3 rounded-2xl border p-3.5 text-left backdrop-blur-sm',
                                'hover:bg-muted/40 active:scale-[0.98] transition-[transform,background-color] duration-100'
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-9 items-center justify-center rounded-xl',
                                    tone === 'aqua' ? 'bg-primary/12 text-primary' : 'bg-sage/15 text-sage'
                                )}
                            >
                                <Icon size={16} strokeWidth={1.75} />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[13px] font-semibold tracking-tight">
                                    {t(`insight.${key}.title`)}
                                </span>
                                <span className="text-muted-foreground mt-1 block text-[12px] leading-snug">
                                    {t(`insight.${key}.body`)}
                                </span>
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>
        </motion.div>
    )
}
