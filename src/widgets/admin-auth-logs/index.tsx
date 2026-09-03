'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchAuthLogs } from '@/entities/auth-log/api/use-search-auth-logs'
import type { AuthLogType } from '@/entities/auth-log/model'
import { Button, Surface, TextInput, SegmentedControl } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'
import { dayjsInstance } from '@/shared/utils'

type TypeFilter = AuthLogType | 'all'

export const AdminAuthLogs = () => {
    const t = useTranslations('admin')
    const [userId, setUserId] = useState('')
    const [type, setType] = useState<TypeFilter>('all')
    const [page, setPage] = useState(1)
    const { mutate: search, data, isPending, isError } = useSearchAuthLogs()

    const runSearch = (nextPage = page) => {
        search({
            pagination: { page: nextPage, count: DEFAULT_PAGE_SIZE },
            filters: {
                ...(userId.trim() ? { userId: userId.trim() } : {}),
                ...(type !== 'all' ? { type } : {})
            },
            sorts: { createdAt: 'DESC' }
        })
    }

    useEffect(() => {
        runSearch(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const logs = data?.data.data ?? []
    const total = data?.data.count ?? 0

    return (
        <div className="flex flex-col gap-4">
            <Surface className="flex flex-col gap-3 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
                    <TextInput
                        label={t('authLogs.userId')}
                        value={userId}
                        onChange={(e) => setUserId(e.currentTarget.value)}
                        className="md:w-56"
                    />
                    <Button
                        type="button"
                        loading={isPending}
                        onClick={() => {
                            setPage(1)
                            runSearch(1)
                        }}
                    >
                        {t('search')}
                    </Button>
                </div>
                <SegmentedControl
                    value={type}
                    onChange={(v) => setType(v as TypeFilter)}
                    options={[
                        { value: 'all', label: t('authLogs.all') },
                        { value: 'Email', label: 'Email' },
                        { value: 'Phone', label: 'Phone' },
                        { value: 'Oauth', label: 'OAuth' }
                    ]}
                />
            </Surface>

            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isPending && logs.length === 0 && <p className="text-muted-foreground text-sm">{t('empty')}</p>}

            <div className="border-hairline overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wide uppercase">
                        <tr>
                            <th className="px-3 py-2 font-medium">{t('authLogs.time')}</th>
                            <th className="px-3 py-2 font-medium">{t('authLogs.type')}</th>
                            <th className="px-3 py-2 font-medium">{t('authLogs.ip')}</th>
                            <th className="px-3 py-2 font-medium">{t('authLogs.user')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-hairline border-t">
                                <td className="text-muted-foreground px-3 py-2.5 whitespace-nowrap">
                                    {dayjsInstance(log.createdAt).format('DD.MM.YYYY HH:mm:ss')}
                                </td>
                                <td className="px-3 py-2.5">{log.type}</td>
                                <td className="font-mono text-xs px-3 py-2.5">{log.ip}</td>
                                <td className="text-muted-foreground px-3 py-2.5">
                                    {log.user?.nickname ?? log.userId}
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
                disabled={isPending}
                onPageChange={(next) => {
                    setPage(next)
                    runSearch(next)
                }}
            />
        </div>
    )
}
