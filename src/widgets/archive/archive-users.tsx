'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@mantine/core'
import { Trash2, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useDeletePerson, useListPersons } from '@/entities/person/api'
import { PersonCard } from '@/entities/person/ui/person-card'
import { Button, IconButton, Loader, Surface } from '@/shared/ui'

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
        return (
            <Surface frost capsule className="px-4 py-8 text-center">
                <p className="text-muted-foreground text-sm">{t('error')}</p>
            </Surface>
        )
    }

    if (people.length === 0) {
        return (
            <Surface frost capsule className="flex flex-col items-center px-5 py-12 text-center">
                <span className="bg-primary/12 text-primary mb-4 flex size-14 items-center justify-center rounded-[18px]">
                    <Users size={24} strokeWidth={1.6} />
                </span>
                <p className="text-sm font-medium tracking-tight">{t('emptyPeople')}</p>
                <p className="text-muted-foreground mt-1.5 max-w-xs text-xs leading-relaxed">{t('emptyPeopleHint')}</p>
            </Surface>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <Surface frost capsule className="overflow-hidden p-1.5 sm:p-2">
                <ul className="flex flex-col">
                    {people.map((person, index) => (
                        <motion.li
                            key={person.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                type: 'spring',
                                bounce: 0,
                                duration: 0.32,
                                delay: Math.min(index * 0.03, 0.24)
                            }}
                            className="group border-hairline flex items-center gap-1 border-b last:border-b-0"
                        >
                            <div className="min-w-0 flex-1">
                                <PersonCard person={person} />
                            </div>
                            <IconButton
                                size="sm"
                                aria-label={t('delete')}
                                className="mr-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                                onClick={() => setPendingId(person.id)}
                            >
                                <Trash2 size={15} />
                            </IconButton>
                        </motion.li>
                    ))}
                </ul>
            </Surface>

            {hasNextPage && (
                <Button
                    variant="subtle"
                    size="sm"
                    className="self-center"
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
