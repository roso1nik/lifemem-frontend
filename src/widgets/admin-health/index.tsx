'use client'

import { useTranslations } from 'next-intl'
import { useHealthCheck } from '@/entities/health/api/use-health-check'
import { HealthServiceStatus } from '@/entities/health/model'
import { Button, Loader, Surface } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { AdminStatusDot } from '@/widgets/admin-shared/chrome'
import { Database, HardDrive, RefreshCw, Server, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

const SERVICE_ICONS: Record<string, LucideIcon> = {
    app: Server,
    postgres: Database,
    redis: Layers,
    s3: HardDrive
}

export const AdminHealth = () => {
    const t = useTranslations('admin')
    const { data, isLoading, isError, isFetching, refetch } = useHealthCheck()

    return (
        <div className="flex max-w-3xl flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold tracking-tight">{t('health.title')}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t('section.health')}</p>
                </div>
                <Button
                    type="button"
                    variant="subtle"
                    size="sm"
                    loading={isFetching}
                    onClick={() => refetch()}
                    className="gap-1.5 rounded-full"
                >
                    <RefreshCw size={14} />
                    {t('health.refresh')}
                </Button>
            </div>

            {isLoading && <Loader variant="section" size="sm" />}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(data ?? []).map((item, index) => {
                    const ok = item.status === HealthServiceStatus.ok
                    const Icon = SERVICE_ICONS[item.service] ?? Server
                    return (
                        <motion.div
                            key={item.service}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.35, delay: index * 0.04 }}
                        >
                            <Surface
                                frost
                                capsule
                                className={cn(
                                    'flex items-center justify-between gap-3 px-4 py-4',
                                    ok
                                        ? 'shadow-[0_0_0_1px_color-mix(in_srgb,var(--sage)_18%,transparent)]'
                                        : 'shadow-[0_0_0_1px_color-mix(in_srgb,#ef4444_22%,transparent)]'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'flex size-10 items-center justify-center rounded-2xl',
                                            ok ? 'bg-sage/15 text-sage' : 'bg-red-500/10 text-red-600'
                                        )}
                                    >
                                        <Icon size={18} strokeWidth={1.7} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold tracking-tight">
                                            {t(`health.service.${item.service}`)}
                                        </p>
                                        <p className="text-muted-foreground mt-0.5 text-xs capitalize">
                                            {item.service}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                                        ok ? 'bg-sage/15 text-sage' : 'bg-red-500/10 text-red-600'
                                    )}
                                >
                                    <AdminStatusDot ok={ok} />
                                    {ok ? t('health.ok') : t('health.error')}
                                </span>
                            </Surface>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
