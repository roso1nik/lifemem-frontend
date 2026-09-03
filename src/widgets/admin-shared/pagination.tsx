'use client'

import { Button } from '@/shared/ui'
import { useTranslations } from 'next-intl'

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

    return (
        <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">
                {t('pagination', { page, totalPages, total })}
            </p>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="subtle"
                    size="sm"
                    disabled={disabled || page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    {t('prev')}
                </Button>
                <Button
                    type="button"
                    variant="subtle"
                    size="sm"
                    disabled={disabled || page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    {t('next')}
                </Button>
            </div>
        </div>
    )
}
