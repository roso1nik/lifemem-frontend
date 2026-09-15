'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useListPersons } from '@/entities/person/api'
import { PersonCard } from '@/entities/person/ui/person-card'
import { Button, Loader } from '@/shared/ui'

type ArchiveUsersProps = {
    query: string
}

export const ArchiveUsers = ({ query }: ArchiveUsersProps) => {
    const t = useTranslations('home.archive')
    const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = useListPersons({
        query: query || undefined
    })

    const people = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data])

    if (isLoading) {
        return <Loader variant="section" />
    }

    if (isError) {
        return <p className="text-muted-foreground px-1 py-6 text-sm">{t('error')}</p>
    }

    if (people.length === 0) {
        return <p className="text-muted-foreground px-1 py-6 text-sm">{t('emptyPeople')}</p>
    }

    return (
        <div className="flex flex-col gap-1">
            <ul className="flex flex-col">
                {people.map((person) => (
                    <li key={person.id}>
                        <PersonCard person={person} />
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
