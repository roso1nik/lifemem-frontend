'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useListPlaces } from '@/entities/place/api'
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
                    <li key={place.id}>
                        <PlaceCard place={place} />
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
        </div>
    )
}
