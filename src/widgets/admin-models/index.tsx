'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useSearchAiModels, useUpdateAiModel } from '@/entities/ai-model/api/use-ai-model'
import type { AiModelType } from '@/entities/ai-model/model'
import { Button, Loader, SegmentedControl, TextInput } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE, type SortDirection } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'
import {
    AdminEmptyState,
    AdminFilterCard,
    AdminSortButton,
    AdminTableCard,
    cycleSort
} from '@/widgets/admin-shared/chrome'
import { Cpu, Search } from 'lucide-react'

const filterSchema = z.object({
    query: z.string(),
    type: z.enum(['all', 'TextToText', 'Embedding', 'ImageToText'])
})

type FilterValues = z.infer<typeof filterSchema>

export const AdminModels = () => {
    const t = useTranslations('admin')
    const [page, setPage] = useState(1)
    const [nameSort, setNameSort] = useState<SortDirection>('ASC')
    const form = useForm<FilterValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: { query: '', type: 'all' }
    })
    const type = form.watch('type')

    const { mutate: search, data, isPending, isError } = useSearchAiModels()
    const { mutate: updateModel, isPending: isUpdating } = useUpdateAiModel()

    const runSearch = (
        nextPage = 1,
        nextType = type,
        nextQuery = form.getValues('query'),
        sort: SortDirection = nameSort
    ) => {
        setPage(nextPage)
        search({
            pagination: { page: nextPage, count: DEFAULT_PAGE_SIZE },
            query: nextQuery.trim() || undefined,
            filters: {
                ...(nextType !== 'all' ? { type: nextType as AiModelType } : {})
            },
            sorts: { name: sort }
        })
    }

    useEffect(() => {
        runSearch(1, type)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type])

    const models = data?.data.data ?? []
    const total = data?.data.count ?? 0

    return (
        <div className="flex flex-col gap-4">
            <AdminFilterCard className="flex flex-col gap-3">
                <form
                    className="flex flex-col gap-2 sm:flex-row sm:items-center"
                    onSubmit={form.handleSubmit((values) => runSearch(1, values.type, values.query, nameSort))}
                >
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
                    <Button type="submit" loading={isPending} className="shrink-0 gap-1.5 rounded-full">
                        <Search size={15} />
                        {t('search')}
                    </Button>
                </form>
                <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <SegmentedControl
                            value={field.value}
                            onChange={field.onChange}
                            options={[
                                { value: 'all', label: t('models.allTypes') },
                                { value: 'TextToText', label: 'TextToText' },
                                { value: 'Embedding', label: 'Embedding' },
                                { value: 'ImageToText', label: 'ImageToText' }
                            ]}
                        />
                    )}
                />
            </AdminFilterCard>

            {isPending && !data && <Loader variant="section" size="sm" />}
            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isPending && models.length === 0 && (
                <AdminEmptyState title={t('empty')} hint={t('section.models')} Icon={Cpu} />
            )}

            {models.length > 0 && (
                <AdminTableCard>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-sm">
                            <thead className="bg-muted/35 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">
                                        <AdminSortButton
                                            label={t('models.name')}
                                            active
                                            direction={nameSort}
                                            onToggle={() => {
                                                const next = cycleSort(nameSort)
                                                setNameSort(next)
                                                runSearch(1, type, form.getValues('query'), next)
                                            }}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('models.type')}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase">
                                        {t('models.active')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map((model) => (
                                    <tr
                                        key={model.id}
                                        className="border-hairline hover:bg-muted/25 border-t transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium tracking-tight">{model.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-muted/60 text-muted-foreground rounded-full px-2 py-0.5 text-[11px] font-medium">
                                                {model.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Switch
                                                checked={model.isActive}
                                                disabled={isUpdating}
                                                onChange={(e) => {
                                                    updateModel(
                                                        {
                                                            id: model.id,
                                                            data: { isActive: e.currentTarget.checked }
                                                        },
                                                        {
                                                            onSuccess: () =>
                                                                runSearch(
                                                                    page,
                                                                    type,
                                                                    form.getValues('query'),
                                                                    nameSort
                                                                )
                                                        }
                                                    )
                                                }}
                                            />
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
                onPageChange={(next) => runSearch(next, type, form.getValues('query'), nameSort)}
            />
        </div>
    )
}
