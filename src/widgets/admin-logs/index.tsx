'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchLogs, type LogsSearchRequest } from '@/entities/logs/api/use-search-logs'
import { Button, Surface, TextInput } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'
import { dayjsInstance } from '@/shared/utils'

const buildRequest = (
    page: number,
    filters: { path: string; method: string; code: string; userId: string }
): LogsSearchRequest => {
    const codeNum = filters.code.trim() ? Number(filters.code.trim()) : undefined

    return {
        pagination: { page, count: DEFAULT_PAGE_SIZE },
        filters: {
            ...(filters.path.trim() ? { path: filters.path.trim() } : {}),
            ...(filters.method.trim() ? { method: filters.method.trim() } : {}),
            ...(filters.userId.trim() ? { userId: filters.userId.trim() } : {}),
            ...(codeNum !== undefined && !Number.isNaN(codeNum) ? { code: codeNum } : {})
        },
        sorts: { createdAt: 'DESC' }
    }
}

export const AdminLogs = () => {
    const t = useTranslations('admin')
    const [path, setPath] = useState('')
    const [method, setMethod] = useState('')
    const [code, setCode] = useState('')
    const [userId, setUserId] = useState('')
    const [request, setRequest] = useState<LogsSearchRequest>(() =>
        buildRequest(1, { path: '', method: '', code: '', userId: '' })
    )

    const { data, isFetching, isError, isLoading } = useSearchLogs(request)

    const logs = data?.data ?? []
    const total = data?.count ?? 0
    const page = request.pagination.page

    const applyFilters = () => {
        setRequest(buildRequest(1, { path, method, code, userId }))
    }

    return (
        <div className="flex flex-col gap-4">
            <Surface className="flex flex-col gap-3 p-4 md:flex-row md:flex-wrap md:items-end">
                <TextInput label={t('logs.path')} value={path} onChange={(e) => setPath(e.currentTarget.value)} className="md:w-48" />
                <TextInput
                    label={t('logs.method')}
                    value={method}
                    onChange={(e) => setMethod(e.currentTarget.value)}
                    className="md:w-28"
                />
                <TextInput label={t('logs.code')} value={code} onChange={(e) => setCode(e.currentTarget.value)} className="md:w-24" />
                <TextInput
                    label={t('logs.userId')}
                    value={userId}
                    onChange={(e) => setUserId(e.currentTarget.value)}
                    className="md:w-56"
                />
                <Button type="button" loading={isFetching} onClick={applyFilters}>
                    {t('search')}
                </Button>
            </Surface>

            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isLoading && logs.length === 0 && <p className="text-muted-foreground text-sm">{t('empty')}</p>}

            <div className="border-hairline overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wide uppercase">
                        <tr>
                            <th className="px-3 py-2 font-medium">{t('logs.time')}</th>
                            <th className="px-3 py-2 font-medium">{t('logs.method')}</th>
                            <th className="px-3 py-2 font-medium">{t('logs.path')}</th>
                            <th className="px-3 py-2 font-medium">{t('logs.code')}</th>
                            <th className="px-3 py-2 font-medium">{t('logs.duration')}</th>
                            <th className="px-3 py-2 font-medium">{t('logs.user')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-hairline border-t">
                                <td className="text-muted-foreground px-3 py-2.5 whitespace-nowrap">
                                    {dayjsInstance(log.createdAt).format('DD.MM.YYYY HH:mm:ss')}
                                </td>
                                <td className="px-3 py-2.5 font-mono text-xs">{log.method ?? '—'}</td>
                                <td className="max-w-[240px] truncate px-3 py-2.5 font-mono text-xs">{log.path}</td>
                                <td className="px-3 py-2.5">{log.code}</td>
                                <td className="text-muted-foreground px-3 py-2.5">{log.duration}ms</td>
                                <td className="text-muted-foreground px-3 py-2.5">
                                    {log.user?.nickname ?? log.userId ?? '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination
                page={page}
                pageSize={DEFAULT_PAGE_SIZE}
                total={total}
                disabled={isFetching}
                onPageChange={(next) => {
                    setRequest((prev) => ({
                        ...prev,
                        pagination: { ...prev.pagination, page: next }
                    }))
                }}
            />
        </div>
    )
}
