'use client'

import { useTranslations } from 'next-intl'
import { useHealthCheck } from '@/entities/health/api/use-health-check'
import { HealthServiceStatus } from '@/entities/health/model'
import { Button, Surface } from '@/shared/ui'
import { cn } from '@/shared/utils'

export const AdminHealth = () => {
    const t = useTranslations('admin')
    const { data, isLoading, isError, isFetching, refetch } = useHealthCheck()

    return (
        <div className="flex max-w-lg flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium">{t('health.title')}</h2>
                <Button type="button" variant="subtle" size="sm" loading={isFetching} onClick={() => refetch()}>
                    {t('health.refresh')}
                </Button>
            </div>

            {isLoading && <p className="text-muted-foreground text-sm">{t('loading')}</p>}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}

            <div className="flex flex-col gap-2">
                {(data ?? []).map((item) => {
                    const ok = item.status === HealthServiceStatus.ok
                    return (
                        <Surface
                            key={item.service}
                            className="flex items-center justify-between gap-3 px-4 py-3"
                        >
                            <span className="text-sm font-medium">{t(`health.service.${item.service}`)}</span>
                            <span
                                className={cn(
                                    'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    ok ? 'bg-sage/20 text-sage' : 'bg-red-500/15 text-red-600'
                                )}
                            >
                                {ok ? t('health.ok') : t('health.error')}
                            </span>
                        </Surface>
                    )
                })}
            </div>
        </div>
    )
}
