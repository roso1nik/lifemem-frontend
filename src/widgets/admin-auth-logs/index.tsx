'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useTranslations } from 'next-intl'
import { useSearchAuthLogs } from '@/entities/auth-log/api/use-search-auth-logs'
import type { AuthLogType } from '@/entities/auth-log/model'
import { Button, Loader, TextInput, SegmentedControl } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE, type SortDirection } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'
import {
    AdminEmptyState,
    AdminFilterCard,
    AdminSortButton,
    AdminTableCard,
    cycleSort
} from '@/widgets/admin-shared/chrome'
import { dayjsInstance, cn } from '@/shared/utils'
import { ChevronDown, Search, Shield } from 'lucide-react'

const filterSchema = z.object({
    query: z.string(),
    userId: z.string(),
    type: z.enum(['all', 'Email', 'Phone', 'Oauth'])
})

type FilterValues = z.infer<typeof filterSchema>

export const AdminAuthLogs = () => {
    const t = useTranslations('admin')
    const [page, setPage] = useState(1)
    const [createdSort, setCreatedSort] = useState<SortDirection>('DESC')
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const form = useForm<FilterValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: { query: '', userId: '', type: 'all' }
    })
    const { mutate: search, data, isPending, isError } = useSearchAuthLogs()

    const runSearch = (values: FilterValues, nextPage = 1, sort: SortDirection = createdSort) => {
        setPage(nextPage)
        search({
            pagination: { page: nextPage, count: DEFAULT_PAGE_SIZE },
            query: values.query.trim() || undefined,
            filters: {
                ...(values.userId.trim() ? { userId: values.userId.trim() } : {}),
                ...(values.type !== 'all' ? { type: values.type as AuthLogType } : {})
            },
            sorts: { createdAt: sort }
        })
    }

    useEffect(() => {
        runSearch(form.getValues(), 1, createdSort)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const logs = data?.data.data ?? []
    const total = data?.data.count ?? 0

    return (
        <div className="flex flex-col gap-4">
            <AdminFilterCard className="flex flex-col gap-3">
                <form
                    className="flex flex-col gap-3"
                    onSubmit={form.handleSubmit((values) => runSearch(values, 1, createdSort))}
                >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Controller
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <TextInput
                                    {...field}
                                    placeholder={t('queryPlaceholder')}
                                    leftSection={<Search size={16} />}
                                    className="min-w-0 flex-1"
                                />
                            )}
                        />
                        <div className="flex shrink-0 gap-2">
                            <Button type="submit" loading={isPending} className="gap-1.5 rounded-full">
                                <Search size={15} />
                                {t('search')}
                            </Button>
                            <Button
                                type="button"
                                variant="subtle"
                                className="gap-1 rounded-full"
                                onClick={() => setAdvancedOpen((v) => !v)}
                            >
                                {t('advancedFilters')}
                                <ChevronDown
                                    size={14}
                                    className={cn('transition-transform', advancedOpen && 'rotate-180')}
                                />
                            </Button>
                        </div>
                    </div>

                    {advancedOpen && (
                        <div className="border-hairline bg-muted/20 flex flex-col gap-3 rounded-[14px] border p-3">
                            <Controller
                                control={form.control}
                                name="userId"
                                render={({ field }) => (
                                    <TextInput {...field} label={t('authLogs.userId')} className="md:max-w-sm" />
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm font-medium">{t('authLogs.type')}</p>
                                        <SegmentedControl
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={[
                                                { value: 'all', label: t('authLogs.all') },
                                                { value: 'Email', label: 'Email' },
                                                { value: 'Phone', label: 'Phone' },
                                                { value: 'Oauth', label: 'OAuth' }
                                            ]}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </form>
            </AdminFilterCard>

            {isPending && !data && <Loader variant="section" size="sm" />}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isPending && logs.length === 0 && (
                <AdminEmptyState title={t('empty')} hint={t('section.authLogs')} Icon={Shield} />
            )}

            {logs.length > 0 && (
                <AdminTableCard>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-muted/35 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">
                                        <AdminSortButton
                                            label={t('authLogs.time')}
                                            active
                                            direction={createdSort}
                                            onToggle={() => {
                                                const next = cycleSort(createdSort)
                                                setCreatedSort(next)
                                                runSearch(form.getValues(), 1, next)
                                            }}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('authLogs.type')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('authLogs.ip')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('authLogs.user')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-hairline hover:bg-muted/25 border-t transition-colors"
                                    >
                                        <td className="text-muted-foreground px-4 py-3 whitespace-nowrap tabular-nums">
                                            {dayjsInstance(log.createdAt).format('DD.MM.YYYY HH:mm:ss')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-muted/60 rounded-full px-2 py-0.5 text-[11px] font-medium">
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs">{log.ip}</td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {log.user?.nickname ?? log.userId}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AdminTableCard>
            )}

            <AdminPagination
                page={page}
                pageSize={DEFAULT_PAGE_SIZE}
                total={total}
                disabled={isPending}
                onPageChange={(next) => runSearch(form.getValues(), next, createdSort)}
            />
        </div>
    )
}
