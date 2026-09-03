'use client'

import { useEffect, useState } from 'react'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useSearchAiModels, useUpdateAiModel } from '@/entities/ai-model/api/use-ai-model'
import type { AiModelType } from '@/entities/ai-model/model'
import { Button, Surface, TextInput } from '@/shared/ui'
import { DEFAULT_PAGE_SIZE } from '@/shared/types'
import { AdminPagination } from '@/widgets/admin-shared/pagination'

export const AdminModels = () => {
    const t = useTranslations('admin')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const { mutate: search, data, isPending, isError } = useSearchAiModels()
    const { mutate: updateModel, isPending: isUpdating } = useUpdateAiModel()

    const runSearch = (nextPage = page) => {
        search({
            pagination: { page: nextPage, count: DEFAULT_PAGE_SIZE },
            filters: {
                ...(type.trim() ? { type: type.trim() as AiModelType } : {})
            },
            sorts: { name: 'ASC' }
        })
    }

    useEffect(() => {
        runSearch(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const models = data?.data.data ?? []
    const total = data?.data.count ?? 0

    return (
        <div className="flex flex-col gap-4">
            <Surface className="flex flex-col gap-3 p-4 md:flex-row md:items-end">
                <TextInput
                    label={t('models.type')}
                    placeholder="TextToText / Embedding / ImageToText"
                    value={type}
                    onChange={(e) => setType(e.currentTarget.value)}
                    className="md:w-72"
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
            </Surface>

            {isError && <p className="text-sm text-red-600">{t('error')}</p>}
            {!isPending && models.length === 0 && <p className="text-muted-foreground text-sm">{t('empty')}</p>}

            <div className="border-hairline overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground text-xs tracking-wide uppercase">
                        <tr>
                            <th className="px-3 py-2 font-medium">{t('models.name')}</th>
                            <th className="px-3 py-2 font-medium">{t('models.type')}</th>
                            <th className="px-3 py-2 font-medium">{t('models.active')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {models.map((model) => (
                            <tr key={model.id} className="border-hairline border-t">
                                <td className="px-3 py-2.5 font-medium">{model.name}</td>
                                <td className="text-muted-foreground px-3 py-2.5">{model.type}</td>
                                <td className="px-3 py-2.5">
                                    <Switch
                                        checked={model.isActive}
                                        disabled={isUpdating}
                                        onChange={(e) => {
                                            updateModel(
                                                { id: model.id, data: { isActive: e.currentTarget.checked } },
                                                { onSuccess: () => runSearch(page) }
                                            )
                                        }}
                                    />
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
