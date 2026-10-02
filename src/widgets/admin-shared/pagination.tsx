'use client'

import { Button } from '@/shared/ui'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Surface } from '@/shared/ui'

type AdminPaginationProps = {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    disabled?: boolean
}

export const AdminPagination = ({ page, pageSize, total, onPageChange, disabled }: AdminPaginationProps) => {
    const t = useTranslations('admin')
    const totalPages = Math.max(1, Math.ceil(total / pageSize))

    if (total === 0) return null

    return (
        <Surface frost capsule className="mt-1 flex items-center justify-between gap-3 px-4 py-2.5">
            <p className="text-muted-foreground text-xs tabular-nums">
                {t('pagination', { page, totalPages, total })}
            </p>
            <div className="flex items-center gap-1.5">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled || page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="gap-1"
                >
                    <ChevronLeft size={14} />
                    {t('prev')}
                </Button>
                <span className="bg-muted text-foreground rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums">
                    {page}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={disabled || page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="gap-1"
                >
                    {t('next')}
                    <ChevronRight size={14} />
                </Button>
            </div>
        </Surface>
    )
}
