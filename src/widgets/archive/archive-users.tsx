'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { useDeletePerson, useListPersons } from '@/entities/person/api'
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
    const { mutate: deletePerson, isPending } = useDeletePerson()
    const [pendingId, setPendingId] = useState<string | null>(null)

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
                    <li key={person.id} className="group flex items-center gap-1">
                        <div className="min-w-0 flex-1">
                            <PersonCard person={person} />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                            onClick={() => setPendingId(person.id)}
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
                title={t('deletePersonTitle')}
                centered
            >
                <p className="text-muted-foreground text-sm">{t('deletePersonConfirm')}</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="subtle" onClick={() => setPendingId(null)}>
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        loading={isPending}
                        onClick={() => {
                            if (!pendingId) return
                            deletePerson(pendingId, { onSuccess: () => setPendingId(null) })
                        }}
                    >
                        {t('delete')}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
