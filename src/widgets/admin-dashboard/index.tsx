'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
    Activity,
    Coins,
    Database,
    FileImage,
    HardDrive,
    NotebookText,
    RefreshCw,
    Timer,
    TriangleAlert,
    Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAdminDashboard } from '@/entities/admin-dashboard/api'
import { Button, Loader, Surface } from '@/shared/ui'
import { AdminEmptyState, AdminFilterCard, AdminTableCard } from '@/widgets/admin-shared/chrome'
import { cn } from '@/shared/utils'

const formatBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let value = bytes
    let unit = 0
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024
        unit += 1
    }
    return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`
}

const formatMs = (ms: number | null) => {
    if (ms == null || !Number.isFinite(ms)) return '—'
    if (ms < 1000) return `${Math.round(ms)} ms`
    return `${(ms / 1000).toFixed(1)} s`
}

const formatMoney = (value: number) => {
    if (!Number.isFinite(value)) return '—'
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 })
}

type Metric = {
    key:
        | 'usersCount'
        | 'entriesCount'
        | 'readyEntriesCount'
        | 'activeUsersCount'
        | 'mediaCount'
        | 'uploadedBytes'
        | 'aiRequestsCount'
        | 'avgAiTimeMs'
        | 'aiCost'
        | 'failedJobsCount'
    Icon: LucideIcon
    tone: 'aqua' | 'sage' | 'danger'
    format: (value: number | null) => string
}

const METRICS: Metric[] = [
    { key: 'usersCount', Icon: Users, tone: 'aqua', format: (v) => String(v ?? 0) },
    { key: 'entriesCount', Icon: NotebookText, tone: 'sage', format: (v) => String(v ?? 0) },
    { key: 'readyEntriesCount', Icon: NotebookText, tone: 'aqua', format: (v) => String(v ?? 0) },
    { key: 'activeUsersCount', Icon: Activity, tone: 'sage', format: (v) => String(v ?? 0) },
    { key: 'mediaCount', Icon: FileImage, tone: 'aqua', format: (v) => String(v ?? 0) },
    { key: 'uploadedBytes', Icon: HardDrive, tone: 'sage', format: (v) => formatBytes(v ?? 0) },
    { key: 'aiRequestsCount', Icon: Database, tone: 'aqua', format: (v) => String(v ?? 0) },
    { key: 'avgAiTimeMs', Icon: Timer, tone: 'sage', format: (v) => formatMs(v) },
    { key: 'aiCost', Icon: Coins, tone: 'aqua', format: (v) => formatMoney(v ?? 0) },
    { key: 'failedJobsCount', Icon: TriangleAlert, tone: 'danger', format: (v) => String(v ?? 0) }
]

export const AdminDashboard = () => {
    const t = useTranslations('admin')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const { data, isLoading, isError, isFetching, refetch } = useAdminDashboard({
        from: from || undefined,
        to: to || undefined
    })

    return (
        <div className="flex flex-col gap-5">
            <AdminFilterCard className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-muted-foreground text-xs font-medium">{t('dashboard.from')}</span>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.currentTarget.value)}
                            className="border-hairline bg-background/80 text-foreground focus:border-primary rounded-[var(--radius-input)] border px-3 py-2.5 text-sm outline-none"
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-muted-foreground text-xs font-medium">{t('dashboard.to')}</span>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.currentTarget.value)}
                            className="border-hairline bg-background/80 text-foreground focus:border-primary rounded-[var(--radius-input)] border px-3 py-2.5 text-sm outline-none"
                        />
                    </label>
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
                    {t('dashboard.refresh')}
                </Button>
            </AdminFilterCard>

            {isLoading && <Loader variant="section" size="sm" />}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}

            {data && (
                <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {METRICS.map(({ key, Icon, tone, format }) => (
                            <Surface key={key} frost capsule className="flex items-start gap-3 p-4">
                                <span
                                    className={cn(
                                        'flex size-10 shrink-0 items-center justify-center rounded-2xl',
                                        tone === 'aqua' && 'bg-primary/12 text-primary',
                                        tone === 'sage' && 'bg-sage/15 text-sage',
                                        tone === 'danger' && 'bg-red-500/10 text-red-600'
                                    )}
                                >
                                    <Icon size={18} strokeWidth={1.7} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-muted-foreground text-xs font-medium tracking-tight">
                                        {t(`dashboard.metric.${key}`)}
                                    </p>
                                    <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">
                                        {format(data[key])}
                                    </p>
                                </div>
                            </Surface>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold tracking-tight">{t('dashboard.tokensTitle')}</h2>
                        {data.tokensByModel.length === 0 ? (
                            <AdminEmptyState title={t('empty')} hint={t('dashboard.tokensEmpty')} />
                        ) : (
                            <AdminTableCard>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[640px] text-left text-sm">
                                        <thead className="border-hairline bg-muted/30 text-muted-foreground border-b text-xs">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">{t('dashboard.col.model')}</th>
                                                <th className="px-4 py-3 font-medium">{t('dashboard.col.requests')}</th>
                                                <th className="px-4 py-3 font-medium">{t('dashboard.col.input')}</th>
                                                <th className="px-4 py-3 font-medium">{t('dashboard.col.output')}</th>
                                                <th className="px-4 py-3 font-medium">{t('dashboard.col.avg')}</th>
                                                <th className="px-4 py-3 font-medium">{t('dashboard.col.price')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-hairline divide-y">
                                            {data.tokensByModel.map((row) => (
                                                <tr key={`${row.modelId ?? 'none'}-${row.modelName}`}>
                                                    <td className="px-4 py-3 font-medium">{row.modelName}</td>
                                                    <td className="px-4 py-3 tabular-nums">{row.requests}</td>
                                                    <td className="px-4 py-3 tabular-nums">{row.inputTokens}</td>
                                                    <td className="px-4 py-3 tabular-nums">{row.outputTokens}</td>
                                                    <td className="px-4 py-3 tabular-nums">
                                                        {formatMs(row.avgTimeMs)}
                                                    </td>
                                                    <td className="px-4 py-3 tabular-nums">
                                                        {formatMoney(row.price)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </AdminTableCard>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
