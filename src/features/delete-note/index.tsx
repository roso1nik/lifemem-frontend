'use client'

import { useState } from 'react'
import { Modal } from '@mantine/core'
import { Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useDeleteEntry } from '@/entities/entry/api/use-delete-entry'
import { Button, IconButton } from '@/shared/ui'

type DeleteNoteButtonProps = {
    entryId: string
    label?: string
    onDeleted?: () => void
}

export const DeleteNoteButton = ({ entryId, label, onDeleted }: DeleteNoteButtonProps) => {
    const t = useTranslations('home')
    const [opened, setOpened] = useState(false)
    const { mutate, isPending } = useDeleteEntry()

    return (
        <>
            <IconButton aria-label={label ?? t('note.delete')} onClick={() => setOpened(true)}>
                <Trash2 size={16} />
            </IconButton>

            <Modal opened={opened} onClose={() => setOpened(false)} title={t('note.deleteTitle')} centered>
                <p className="text-muted-foreground text-sm">{t('note.deleteConfirm')}</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="subtle" onClick={() => setOpened(false)}>
                        {t('note.cancel')}
                    </Button>
                    <Button
                        variant="danger"
                        loading={isPending}
                        onClick={() =>
                            mutate(entryId, {
                                onSuccess: () => {
                                    setOpened(false)
                                    onDeleted?.()
                                }
                            })
                        }
                    >
                        {t('note.delete')}
                    </Button>
                </div>
            </Modal>
        </>
    )
}
