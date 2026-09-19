'use client'

import { useMemo, useState } from 'react'
import { Modal } from '@mantine/core'
import { Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useGetEntry } from '@/entities/entry/api/use-get-entry'
import { getEntryPreviewText } from '@/entities/entry/model'
import { DeleteNoteButton } from '@/features/delete-note'
import { EditNoteForm } from '@/features/edit-note'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import {
    Button,
    ImageGallery,
    imageGalleryItemFromEntryPhoto,
    Loader,
    Surface
} from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'

type NoteDetailProps = {
    noteId: string
}

export const NoteDetail = ({ noteId }: NoteDetailProps) => {
    const t = useTranslations('home')
    const { data: entry, isLoading, isError } = useGetEntry(noteId)
    const [editOpen, setEditOpen] = useState(false)
    const { goHome } = useWorkspaceNavigation()

    const galleryItems = useMemo(() => {
        if (!entry?.photos.length) return []
        return entry.photos
            .map((photo, index) =>
                imageGalleryItemFromEntryPhoto(photo, t('note.photoAlt', { index: index + 1 }))
            )
            .filter((item): item is NonNullable<typeof item> => item != null)
    }, [entry, t])

    if (isLoading) {
        return <Loader variant="section" />
    }

    if (isError || !entry) {
        return (
            <div className="mx-auto flex w-full flex-1 flex-col px-4 py-8 md:px-6">
                <h1 className="text-2xl font-semibold tracking-tight">{t('tabNoteMissing')}</h1>
            </div>
        )
    }

    const preview = getEntryPreviewText(entry)
    const body = entry.formattedText?.trim() || entry.text?.trim() || preview
    const hasMeta = entry.voice || entry.people.length > 0 || entry.places.length > 0

    return (
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-8 md:w-4/5 md:px-6">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                        {dayjsInstance(entry.createdAt).format('D MMMM YYYY · HH:mm')}
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                        {entry.title?.trim() || preview.slice(0, 80) || t('tab.notes')}
                    </h1>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    <Button
                        variant="subtle"
                        size="sm"
                        aria-label={t('note.edit')}
                        onClick={() => setEditOpen(true)}
                    >
                        <Pencil size={16} />
                    </Button>
                    <DeleteNoteButton
                        entryId={entry.id}
                        onDeleted={() => goHome()}
                        label={t('note.delete')}
                    />
                </div>
            </div>

            {!entry.isReady && (
                <p className="text-muted-foreground mt-2 text-sm">
                    {t('note.processing', {
                        done: entry.jobs.filter((job) => job.status === 'Done').length,
                        total: entry.jobs.length
                    })}
                </p>
            )}

            {galleryItems.length > 0 && (
                <ImageGallery className="mt-6" items={galleryItems} columns={3} />
            )}

            <Surface className="mt-6 p-5">
                {entry.formattedTextFormat === 'html' ? (
                    <div
                        className="text-[15px] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: body }}
                    />
                ) : (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {body || t('tabNoteMissing')}
                    </p>
                )}

                {hasMeta && (
                    <div className="border-hairline mt-4 flex flex-wrap gap-2 border-t pt-4">
                        {entry.voice && (
                            <span className="bg-muted text-muted-foreground rounded-md px-2.5 py-1 text-xs">
                                {t('note.voice')}
                            </span>
                        )}
                        {entry.people.map((person) => (
                            <span
                                key={person.id}
                                className="bg-sage/15 text-sage rounded-md px-2.5 py-1 text-xs"
                            >
                                {person.name}
                            </span>
                        ))}
                        {entry.places.map((place) => (
                            <span
                                key={place.id}
                                className="bg-sage/15 text-sage rounded-md px-2.5 py-1 text-xs"
                            >
                                {place.name}
                            </span>
                        ))}
                    </div>
                )}
            </Surface>

            <Modal opened={editOpen} onClose={() => setEditOpen(false)} title={t('note.editTitle')} centered>
                <EditNoteForm
                    entryId={entry.id}
                    initialTitle={entry.title}
                    peopleIds={entry.people.map((person) => person.id)}
                    placeIds={entry.places.map((place) => place.id)}
                    onSuccess={() => setEditOpen(false)}
                    onCancel={() => setEditOpen(false)}
                />
            </Modal>
        </div>
    )
}
