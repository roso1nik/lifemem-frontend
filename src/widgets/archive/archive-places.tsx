'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useDeletePlace, useListPlaces } from '@/entities/place/api'
import { PlaceCard } from '@/entities/place/ui/place-card'
import { Button, Loader } from '@/shared/ui'

type ArchivePlacesProps = {
    query: string
}

export const ArchivePlaces = ({ query }: ArchivePlacesProps) => {
    const t = useTranslations('home.archive')
    const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = useListPlaces({
        query: query || undefined
    })
    const { mutate: deletePlace, isPending } = useDeletePlace()
    const [pendingId, setPendingId] = useState<string | null>(null)

    const places = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])

    if (isLoading) {
        return <Loader variant="section" />
    }

    if (isError) {
        return <p className="text-muted-foreground px-1 py-6 text-sm">{t('error')}</p>
    }

    if (places.length === 0) {
        return <p className="text-muted-foreground px-1 py-6 text-sm">{t('emptyPlaces')}</p>
    }

    return (
        <div className="flex flex-col gap-1">
            <ul className="flex flex-col">
                {places.map((place) => (
                    <li key={place.id} className="group flex items-center gap-1">
                        <div className="min-w-0 flex-1">
                            <PlaceCard place={place} />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                            onClick={() => setPendingId(place.id)}
                        >
                            {t('delete')}
                        </Button>
                    </li>
                ))}
            </ul>
            {hasNextPage && (
                <Button
                    variant="subtle"
                    size="sm"
                    className="mt-3 self-center"
                    loading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {t('loadMore')}
                </Button>
            )}

            <Modal
                opened={Boolean(pendingId)}
                onClose={() => setPendingId(null)}
                title={t('deletePlaceTitle')}
                centered
            >
                <p className="text-muted-foreground text-sm">{t('deletePlaceConfirm')}</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="subtle" onClick={() => setPendingId(null)}>
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        loading={isPending}
                        onClick={() => {
                            if (!pendingId) return
                            deletePlace(pendingId, { onSuccess: () => setPendingId(null) })
                        }}
                    >
                        {t('delete')}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
