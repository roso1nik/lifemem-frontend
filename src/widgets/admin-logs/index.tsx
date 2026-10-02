'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useTranslations } from 'next-intl'
import { useSearchLogs, type LogsSearchRequest } from '@/entities/logs/api/use-search-logs'
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
import { ChevronDown, ScrollText, Search } from 'lucide-react'

const filterSchema = z.object({
    query: z.string(),
    path: z.string(),
    method: z.enum(['all', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE']),
    code: z.string(),
    userId: z.string()
})

type FilterValues = z.infer<typeof filterSchema>

const EMPTY_FILTERS: FilterValues = {
    query: '',
    path: '',
    method: 'all',
    code: '',
    userId: ''
}

const buildRequest = (
    page: number,
    filters: FilterValues,
    sort: SortDirection
): LogsSearchRequest => {
    const codeNum = filters.code.trim() ? Number(filters.code.trim()) : undefined

    return {
        pagination: { page, count: DEFAULT_PAGE_SIZE },
        query: filters.query.trim() || undefined,
        filters: {
            ...(filters.path.trim() ? { path: filters.path.trim() } : {}),
            ...(filters.method !== 'all' ? { method: filters.method } : {}),
            ...(filters.userId.trim() ? { userId: filters.userId.trim() } : {}),
            ...(codeNum !== undefined && !Number.isNaN(codeNum) ? { code: codeNum } : {})
        },
        sorts: { createdAt: sort }
    }
}

export const AdminLogs = () => {
    const t = useTranslations('admin')
    const [createdSort, setCreatedSort] = useState<SortDirection>('DESC')
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const form = useForm<FilterValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: EMPTY_FILTERS
    })
    const [request, setRequest] = useState<LogsSearchRequest>(() =>
        buildRequest(1, EMPTY_FILTERS, 'DESC')
    )

    const { data, isFetching, isError, isLoading } = useSearchLogs(request)

    const logs = data?.data ?? []
    const total = data?.count ?? 0
    const page = request.pagination.page

    const runSearch = (values: FilterValues, nextPage = 1, sort: SortDirection = createdSort) => {
        setRequest(buildRequest(nextPage, values, sort))
    }

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
                            <Button type="submit" loading={isFetching} className="gap-1.5 rounded-full">
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
                            <div className="grid gap-3 md:grid-cols-3">
                                <Controller
                                    control={form.control}
                                    name="path"
                                    render={({ field }) => (
                                        <TextInput {...field} label={t('logs.path')} />
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <TextInput {...field} label={t('logs.code')} />
                                    )}
                                />
                                <Controller
                                    control={form.control}
                                    name="userId"
                                    render={({ field }) => (
                                        <TextInput {...field} label={t('logs.userId')} />
                                    )}
                                />
                            </div>
                            <Controller
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-1.5">
                                        <p className="text-sm font-medium">{t('logs.method')}</p>
                                        <SegmentedControl
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={[
                                                { value: 'all', label: t('logs.allMethods') },
                                                { value: 'GET', label: 'GET' },
                                                { value: 'POST', label: 'POST' },
                                                { value: 'PATCH', label: 'PATCH' },
                                                { value: 'PUT', label: 'PUT' },
                                                { value: 'DELETE', label: 'DELETE' }
                                            ]}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </form>
            </AdminFilterCard>

            {isLoading && <Loader variant="section" size="sm" />}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isLoading && logs.length === 0 && (
                <AdminEmptyState title={t('empty')} hint={t('section.logs')} Icon={ScrollText} />
            )}

            {logs.length > 0 && (
                <AdminTableCard>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-muted/35 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">
                                        <AdminSortButton
                                            label={t('logs.time')}
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
                                        {t('logs.method')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('logs.path')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('logs.code')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('logs.duration')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('logs.user')}
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
                                            <span className="bg-muted/60 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium">
                                                {log.method ?? '—'}
                                            </span>
                                        </td>
                                        <td className="max-w-[240px] truncate px-4 py-3 font-mono text-xs">
                                            {log.path}
                                        </td>
                                        <td className="px-4 py-3 tabular-nums">{log.code}</td>
                                        <td className="text-muted-foreground px-4 py-3 tabular-nums">
                                            {log.duration}ms
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3">
                                            {log.user?.nickname ?? log.userId ?? '—'}
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
                disabled={isFetching}
                onPageChange={(next) => runSearch(form.getValues(), next, createdSort)}
            />
        </div>
    )
}
