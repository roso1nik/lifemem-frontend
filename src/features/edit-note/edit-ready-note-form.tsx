'use client'

import { useRef, useState, type FormEvent } from 'react'
import { ImagePlus, MapPin, Mic, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useUpdateEntryContent } from '@/entities/entry/api/use-update-entry-content'
import { useAttachEntryMedia } from '@/entities/entry/api/use-entry-media'
import {
    useLinkEntryPerson,
    useUnlinkEntryPerson,
    useLinkEntryPlace,
    useUnlinkEntryPlace
} from '@/entities/entry/api/use-entry-relations'
import type { FormattedTextFormat } from '@/entities/entry/model'
import { PRODUCT_MEDIA_TYPES, UploadValidationError, uploadFile } from '@/entities/upload'
import { PeoplePicker, PlacesPicker, type RelationOption } from '@/features/note-relations'
import { getApiErrorMessage } from '@/shared/api/errors'
import { Button, RichTextEditor, Surface, TextInput, isEmptyHtml } from '@/shared/ui'
import { cn } from '@/shared/utils'

type EditReadyNoteFormProps = {
    entryId: string
    initialTitle: string
    initialBody: string
    formattedTextFormat: FormattedTextFormat | null
    hasVoice: boolean
    mediaCount: number
    initialPeople: RelationOption[]
    initialPlaces: RelationOption[]
    onSuccess?: () => void
    onCancel?: () => void
}

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isUuid = (id: string) => UUID_RE.test(id.trim())

const stripHtml = (html: string): string =>
    html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+\n/g, '\n')
        .replace(/\n\s+/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim()

const toEditorHtml = (body: string, format: FormattedTextFormat | null): string => {
    const trimmed = body.trim()
    if (!trimmed) return ''
    if (format === 'html' || /^<[a-z][\s\S]*>/i.test(trimmed)) return trimmed
    return `<p>${trimmed
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')}</p>`
}

const syncRelations = async (
    initial: RelationOption[],
    next: RelationOption[],
    link: (id: string) => Promise<unknown>,
    unlink: (id: string) => Promise<unknown>
) => {
    const initialIds = new Set(initial.map((item) => item.id))
    const nextIds = new Set(next.map((item) => item.id))

    for (const item of next) {
        if (!initialIds.has(item.id)) await link(item.id)
    }
    for (const item of initial) {
        if (!nextIds.has(item.id)) await unlink(item.id)
    }
}

export const EditReadyNoteForm = ({
    entryId,
    initialTitle,
    initialBody,
    formattedTextFormat,
    hasVoice,
    mediaCount,
    initialPeople,
    initialPlaces,
    onSuccess,
    onCancel
}: EditReadyNoteFormProps) => {
    const t = useTranslations('home')
    const fileRef = useRef<HTMLInputElement>(null)
    const [title, setTitle] = useState(initialTitle)
    const [body, setBody] = useState(() => toEditorHtml(initialBody, formattedTextFormat))
    const [people, setPeople] = useState<RelationOption[]>(() =>
        initialPeople.filter((item) => item.id && item.name)
    )
    const [places, setPlaces] = useState<RelationOption[]>(() =>
        initialPlaces.filter((item) => item.id && item.name)
    )
    const [saving, setSaving] = useState(false)
    const [attaching, setAttaching] = useState(false)
    const [attachedExtra, setAttachedExtra] = useState(0)

    const { mutateAsync: updateContent } = useUpdateEntryContent()
    const { mutateAsync: attachMedia } = useAttachEntryMedia()
    const { mutateAsync: linkPerson } = useLinkEntryPerson()
    const { mutateAsync: unlinkPerson } = useUnlinkEntryPerson()
    const { mutateAsync: linkPlace } = useLinkEntryPlace()
    const { mutateAsync: unlinkPlace } = useUnlinkEntryPlace()

    const currentMediaCount = mediaCount + attachedExtra
    const canAttachMedia = currentMediaCount < 5

    const onAttachFiles = async (files: File[]) => {
        if (!files.length) return
        const room = 5 - currentMediaCount
        if (room <= 0) {
            toast.error(t('mediaLimit'))
            return
        }
        const batch = files.slice(0, room)
        setAttaching(true)
        try {
            for (const file of batch) {
                const fileId = await uploadFile(file, { allowedTypes: PRODUCT_MEDIA_TYPES })
                await attachMedia({ entryId, data: { fileId } })
                setAttachedExtra((n) => n + 1)
            }
            toast.success(t('note.attachSuccess'))
            if (files.length > room) toast.error(t('mediaLimit'))
        } catch (error) {
            if (error instanceof UploadValidationError) {
                toast.error(
                    error.message === 'File exceeds size limit' ? t('uploadTooLarge') : t('uploadInvalid')
                )
            } else {
                toast.error(getApiErrorMessage(error, t('uploadFailed')))
            }
        } finally {
            setAttaching(false)
        }
    }

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault()

        if (places.length > 3) {
            toast.error(t('relations.placeLimit'))
            return
        }

        if (people.some((item) => !isUuid(item.id)) || places.some((item) => !isUuid(item.id))) {
            toast.error(t('relations.invalidIds'))
            return
        }

        const trimmedTitle = title.trim()
        const titleChanged = trimmedTitle !== initialTitle.trim()
        const initialHtml = toEditorHtml(initialBody, formattedTextFormat)
        const bodyChanged = !hasVoice && body !== initialHtml && !(isEmptyHtml(body) && isEmptyHtml(initialHtml))

        setSaving(true)
        try {
            if (hasVoice) {
                if (titleChanged) {
                    await updateContent({
                        id: entryId,
                        data: { title: trimmedTitle }
                    })
                }
            } else if (titleChanged || bodyChanged) {
                const plain = stripHtml(body)
                await updateContent({
                    id: entryId,
                    data: {
                        title: trimmedTitle,
                        text: plain,
                        formattedText: isEmptyHtml(body) ? '' : body,
                        formattedTextFormat: 'html'
                    }
                })
            }

            await syncRelations(
                initialPeople,
                people,
                (personId) => linkPerson({ entryId, data: { personId } }),
                (personId) => unlinkPerson({ entryId, personId })
            )
            await syncRelations(
                initialPlaces,
                places,
                (placeId) => linkPlace({ entryId, data: { placeId } }),
                (placeId) => unlinkPlace({ entryId, placeId })
            )

            onSuccess?.()
        } catch {
            // toasts handled in hooks
        } finally {
            setSaving(false)
        }
    }

    return (
        <form className="flex flex-col gap-5" onSubmit={(e) => void onSubmit(e)}>
            <div className="flex flex-col gap-3">
                <TextInput
                    label={t('note.titleLabel')}
                    value={title}
                    onChange={(event) => setTitle(event.currentTarget.value)}
                    placeholder={t('note.titlePlaceholder')}
                />

                {hasVoice ? (
                    <Surface frost capsule className="flex flex-col gap-2 p-3.5">
                        <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
                            <Mic size={12} strokeWidth={1.75} />
                            {t('note.voice')}
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            {t('note.voiceTextNotEditable')}
                        </p>
                        {initialBody.trim() && (
                            <div
                                className={cn(
                                    'text-foreground/80 border-hairline max-h-40 overflow-y-auto rounded-xl border bg-transparent px-3 py-2.5 text-[13px] leading-relaxed',
                                    formattedTextFormat === 'html' ? '' : 'whitespace-pre-wrap'
                                )}
                                {...(formattedTextFormat === 'html'
                                    ? { dangerouslySetInnerHTML: { __html: initialBody } }
                                    : { children: initialBody })}
                            />
                        )}
                    </Surface>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <p className="text-sm font-medium">{t('note.bodyLabel')}</p>
                        <Surface frost capsule className="overflow-hidden p-2">
                            <RichTextEditor
                                value={body}
                                onChange={setBody}
                                placeholder={t('note.bodyPlaceholder')}
                                bordered
                                minHeight={180}
                            />
                        </Surface>
                    </div>
                )}
            </div>

            <div className="border-hairline flex flex-col gap-3 border-t pt-4">
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t('note.editMediaLabel')}
                </p>
                <Surface frost capsule className="flex flex-col gap-3 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium tracking-tight">{t('note.attachMedia')}</p>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                                {t('note.mediaCount', { count: currentMediaCount, max: 5 })}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="subtle"
                            size="sm"
                            leftSection={<ImagePlus size={14} />}
                            loading={attaching}
                            disabled={!canAttachMedia}
                            onClick={() => fileRef.current?.click()}
                        >
                            {t('note.attachMediaShort')}
                        </Button>
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            const files = Array.from(e.target.files ?? [])
                            e.target.value = ''
                            void onAttachFiles(files)
                        }}
                    />
                </Surface>
            </div>

            <div className="border-hairline flex flex-col gap-3 border-t pt-4">
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t('note.editRelationsLabel')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Surface frost capsule className="p-3.5">
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
                            <Users size={12} strokeWidth={1.75} />
                            {t('relations.people')}
                        </div>
                        <PeoplePicker value={people} onChange={setPeople} hideLabel />
                    </Surface>
                    <Surface frost capsule className="p-3.5">
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
                            <MapPin size={12} strokeWidth={1.75} />
                            {t('relations.places')}
                        </div>
                        <PlacesPicker value={places} onChange={setPlaces} max={3} hideLabel />
                    </Surface>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="subtle" onClick={onCancel}>
                    {t('note.cancel')}
                </Button>
                <Button type="submit" loading={saving}>
                    {t('note.save')}
                </Button>
            </div>
        </form>
    )
}
