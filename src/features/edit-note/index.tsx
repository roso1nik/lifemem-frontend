'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useUpdateEntry } from '@/entities/entry/api/use-update-entry'
import { Button, TextInput } from '@/shared/ui'

type EditNoteFormProps = {
    entryId: string
    initialTitle: string
    peopleIds: string[]
    placeIds: string[]
    onSuccess?: () => void
    onCancel?: () => void
}

export const EditNoteForm = ({
    entryId,
    initialTitle,
    peopleIds,
    placeIds,
    onSuccess,
    onCancel
}: EditNoteFormProps) => {
    const t = useTranslations('home')
    const [title, setTitle] = useState(initialTitle)
    const { mutate, isPending } = useUpdateEntry()

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
                event.preventDefault()
                mutate(
                    {
                        id: entryId,
                        data: {
                            title: title.trim(),
                            peoples: peopleIds,
                            places: placeIds.slice(0, 3)
                        }
                    },
                    { onSuccess: () => onSuccess?.() }
                )
            }}
        >
            <TextInput
                label={t('note.titleLabel')}
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                placeholder={t('note.titlePlaceholder')}
            />
            <p className="text-muted-foreground text-xs">{t('note.editHint')}</p>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="subtle" onClick={onCancel}>
                    {t('note.cancel')}
                </Button>
                <Button type="submit" loading={isPending}>
                    {t('note.save')}
                </Button>
            </div>
        </form>
    )
}
