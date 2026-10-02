'use client'

import { useMemo, useRef, useState } from 'react'
import { Modal } from '@mantine/core'
import { Paperclip, Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useGetEntry } from '@/entities/entry/api/use-get-entry'
import { useAttachEntryMedia, useDetachEntryMedia } from '@/entities/entry/api/use-entry-media'
import { getEntryPreviewText } from '@/entities/entry/model'
import { PRODUCT_MEDIA_TYPES, UploadValidationError, uploadFile } from '@/entities/upload'
import { DeleteNoteButton } from '@/features/delete-note'
import { EditNoteForm } from '@/features/edit-note'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import { getApiErrorMessage } from '@/shared/api/errors'
import {
    Button,
    ImageGallery,
    imageGalleryItemFromEntryMedia,
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
    const [attaching, setAttaching] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)
    const { goHome } = useWorkspaceNavigation()
    const { mutateAsync: attachMedia } = useAttachEntryMedia()
    const { mutate: detachMedia, isPending: detaching } = useDetachEntryMedia()

    const galleryItems = useMemo(() => {
        if (!entry?.media.length) return []
        return entry.media
            .map((media, index) =>
                imageGalleryItemFromEntryMedia(
                    media,
                    t(media.firstFrameUrl || media.url.match(/\.(mp4|webm|mov)/i) ? 'note.videoAlt' : 'note.photoAlt', {
                        index: index + 1
                    })
                )
            )
            .filter((item): item is NonNullable<typeof item> => item != null)
    }, [entry, t])

    const onAttach = async (file: File) => {
        if (!entry?.isReady) {
            toast.error(t('note.attachWhenReady'))
            return
        }
        if ((entry.media?.length ?? 0) >= 5) {
            toast.error(t('mediaLimit'))
            return
        }
        setAttaching(true)
        try {
            const fileId = await uploadFile(file, { allowedTypes: PRODUCT_MEDIA_TYPES })
            await attachMedia({ entryId: entry.id, data: { fileId } })
            toast.success(t('note.attachSuccess'))
        } catch (error) {
            if (error instanceof UploadValidationError) {
                toast.error(error.message === 'File exceeds size limit' ? t('uploadTooLarge') : t('uploadInvalid'))
            } else {
                toast.error(getApiErrorMessage(error, t('uploadFailed')))
            }
        } finally {
            setAttaching(false)
        }
    }

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
    const doneJobs = entry.jobs.filter((job) => job.status === 'Done').length

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
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            e.target.value = ''
                            if (file) void onAttach(file)
                        }}
                    />
                    <Button
                        variant="subtle"
                        size="sm"
                        aria-label={t('note.attachMedia')}
                        loading={attaching}
                        disabled={!entry.isReady || entry.media.length >= 5}
                        onClick={() => fileRef.current?.click()}
                    >
                        <Paperclip size={16} />
                    </Button>
                    {!entry.isReady && (
                        <Button
                            variant="subtle"
                            size="sm"
                            aria-label={t('note.edit')}
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil size={16} />
                        </Button>
                    )}
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
                        done: doneJobs,
                        total: entry.jobs.length
                    })}
                </p>
            )}

            {galleryItems.length > 0 && (
                <ImageGallery
                    className="mt-6"
                    items={galleryItems}
                    columns={3}
                    removeLabel={t('note.detachMedia')}
                    onRemove={
                        entry.isReady && !detaching
                            ? (mediaId) => detachMedia({ entryId: entry.id, mediaId })
                            : undefined
                    }
                />
            )}

            <Surface className="mt-6 p-5">
                {entry.voice?.url && (
                    <div className="mb-4">
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            {t('note.voice')}
                        </p>
                        <audio controls src={entry.voice.url} className="w-full" preload="metadata" />
                    </div>
                )}

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

            <Modal
                opened={editOpen && !entry.isReady}
                onClose={() => setEditOpen(false)}
                title={t('note.editTitle')}
                centered
            >
                <EditNoteForm
                    entryId={entry.id}
                    initialTitle={entry.title}
                    initialPeople={entry.people.map((person) => ({ id: person.id, name: person.name }))}
                    initialPlaces={entry.places.map((place) => ({ id: place.id, name: place.name }))}
                    onSuccess={() => setEditOpen(false)}
                    onCancel={() => setEditOpen(false)}
                />
            </Modal>
        </div>
    )
}
