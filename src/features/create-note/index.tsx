'use client'

import { useCreateEntry, type EntryLocationInput } from '@/entities/entry/api/use-create-entry'
import {
    PRODUCT_MEDIA_TYPES,
    PRODUCT_VOICE_TYPES,
    UploadValidationError,
    uploadFile
} from '@/entities/upload'
import { PeoplePicker, PlacesPicker, type RelationOption } from '@/features/note-relations'
import { getApiErrorMessage } from '@/shared/api/errors'
import { IconButton, RichTextEditor, Surface, isEmptyHtml } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { Menu, Tooltip } from '@mantine/core'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowUp,
    FileIcon,
    MapPin,
    Mic,
    Paperclip,
    Square,
    Users,
    X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

type HintKey = 'file' | 'geo' | 'voice' | 'people'

type PendingAttachment =
    | { id: string; kind: 'media'; file: File; name: string }
    | { id: string; kind: 'voice'; file: File; name: string }
    | { id: string; kind: 'geo'; name: string; location: EntryLocationInput }

export type CreateNoteFormProps = {
    onWritingChange?: (writing: boolean) => void
}

const isInOverlay = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false
    return Boolean(
        target.closest(
            '.mantine-Menu-dropdown, .mantine-Popover-dropdown, .mantine-Tooltip-tooltip, [data-portal]'
        )
    )
}

const readCurrentLocation = (): Promise<EntryLocationInput> =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('geolocation_unavailable'))
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }),
            () => reject(new Error('geolocation_denied')),
            { enableHighAccuracy: true, timeout: 12_000 }
        )
    })

export const CreateNoteForm = ({ onWritingChange }: CreateNoteFormProps) => {
    const t = useTranslations('home')
    const [content, setContent] = useState('')
    const [attachments, setAttachments] = useState<PendingAttachment[]>([])
    const [people, setPeople] = useState<RelationOption[]>([])
    const [places, setPlaces] = useState<RelationOption[]>([])
    const [showRelations, setShowRelations] = useState(false)
    const [focused, setFocused] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [recording, setRecording] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)
    const audioRef = useRef<HTMLInputElement>(null)
    const shellRef = useRef<HTMLDivElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const { mutateAsync: createEntry, isPending } = useCreateEntry()

    const hasText = !isEmptyHtml(content)
    const hasVoice = attachments.some((item) => item.kind === 'voice')
    const mediaCount = attachments.filter((item) => item.kind === 'media').length
    const locationCount = attachments.filter((item) => item.kind === 'geo').length
    const placeSlots = places.length + locationCount
    const hasMedia = mediaCount > 0
    /** Backend requires text or audioId; media-only notes get a minimal text placeholder on submit. */
    const canSend = !(hasText && hasVoice) && (hasText || hasVoice || hasMedia)
    const isWriting =
        focused || hasText || attachments.length > 0 || people.length > 0 || places.length > 0 || showRelations
    const showHints = !hasText && attachments.length === 0 && people.length === 0 && places.length === 0
    const busy = isPending || uploading || recording

    useEffect(() => {
        onWritingChange?.(isWriting)
    }, [isWriting, onWritingChange])

    useEffect(() => {
        if (!focused) return

        const onPointerDown = (event: PointerEvent) => {
            if (shellRef.current?.contains(event.target as Node)) return
            if (isInOverlay(event.target)) return
            setFocused(false)
        }

        document.addEventListener('pointerdown', onPointerDown)
        return () => document.removeEventListener('pointerdown', onPointerDown)
    }, [focused])

    useEffect(() => {
        return () => {
            mediaRecorderRef.current?.stop()
        }
    }, [])

    const addAttachment = (attachment: PendingAttachment) => {
        setAttachments((prev) => [...prev, attachment])
    }

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id))
    }

    const onHint = async (key: HintKey) => {
        if (key === 'file') {
            fileRef.current?.click()
            return
        }
        if (key === 'people') {
            setShowRelations(true)
            setFocused(true)
            return
        }
        if (key === 'geo') {
            if (placeSlots >= 3) {
                toast.error(t('relations.placeLimit'))
                return
            }
            try {
                const location = await readCurrentLocation()
                addAttachment({
                    id: crypto.randomUUID(),
                    kind: 'geo',
                    name: t('hintGeo'),
                    location: { ...location, locationLabel: t('hintGeo') }
                })
            } catch {
                toast.error(t('geoError'))
            }
            return
        }
        if (key === 'voice') {
            if (hasText) {
                toast.error(t('voiceXorText'))
                return
            }
            if (hasVoice) {
                toast.error(t('voiceOneOnly'))
                return
            }
            await startOrPickVoice()
        }
    }

    const startOrPickVoice = async () => {
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
            audioRef.current?.click()
            return
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/mp4')
                  ? 'audio/mp4'
                  : undefined
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
            chunksRef.current = []
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data)
            }
            recorder.onstop = () => {
                stream.getTracks().forEach((track) => track.stop())
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
                const ext = blob.type.includes('mp4') ? 'm4a' : 'webm'
                const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type })
                addAttachment({
                    id: crypto.randomUUID(),
                    kind: 'voice',
                    file,
                    name: t('voice')
                })
                setRecording(false)
                mediaRecorderRef.current = null
            }
            mediaRecorderRef.current = recorder
            recorder.start()
            setRecording(true)
        } catch {
            audioRef.current?.click()
        }
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
    }

    const onSubmit = async () => {
        if (!canSend || busy) return

        const mediaFiles = attachments.filter(
            (item): item is Extract<PendingAttachment, { kind: 'media' }> => item.kind === 'media'
        )
        const voiceItem = attachments.find(
            (item): item is Extract<PendingAttachment, { kind: 'voice' }> => item.kind === 'voice'
        )
        const locations = attachments
            .filter((item): item is Extract<PendingAttachment, { kind: 'geo' }> => item.kind === 'geo')
            .map((item) => item.location)

        if (mediaFiles.length > 5) {
            toast.error(t('mediaLimit'))
            return
        }
        if (places.length + locations.length > 3) {
            toast.error(t('relations.placeLimit'))
            return
        }

        setUploading(true)
        try {
            const mediaIds: { id: string }[] = []
            for (const item of mediaFiles) {
                const fileId = await uploadFile(item.file, { allowedTypes: PRODUCT_MEDIA_TYPES })
                mediaIds.push({ id: fileId })
            }

            let audioId: string | undefined
            if (voiceItem) {
                audioId = await uploadFile(voiceItem.file, { allowedTypes: PRODUCT_VOICE_TYPES })
            }

            const textPayload = hasText
                ? content
                : !audioId && mediaIds.length > 0
                  ? t('mediaOnlyFallback')
                  : undefined

            await createEntry({
                text: textPayload,
                audioId,
                media: mediaIds.length ? mediaIds : undefined,
                personIds: people.length ? people.map((item) => item.id) : undefined,
                placeIds: places.length ? places.map((item) => item.id) : undefined,
                location: locations.length ? locations : undefined
            })

            setContent('')
            setAttachments([])
            setPeople([])
            setPlaces([])
            setShowRelations(false)
            setFocused(false)
        } catch (error) {
            if (error instanceof UploadValidationError) {
                toast.error(error.message === 'File exceeds size limit' ? t('uploadTooLarge') : t('uploadInvalid'))
            } else {
                toast.error(getApiErrorMessage(error, t('uploadFailed')))
            }
        } finally {
            setUploading(false)
        }
    }

    const hints: { key: HintKey; label: string; Icon: typeof FileIcon }[] = [
        { key: 'file', label: t('hintFile'), Icon: FileIcon },
        { key: 'geo', label: t('hintGeo'), Icon: MapPin },
        { key: 'people', label: t('hintPeople'), Icon: Users },
        { key: 'voice', label: t('hintVoice'), Icon: Mic }
    ]

    return (
        <motion.div
            ref={shellRef}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className={cn('flex flex-col gap-3', isWriting && 'min-h-0 flex-1')}
        >
            <AnimatePresence initial={false}>
                {showHints && (
                    <motion.div
                        key="hints"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="text-muted-foreground mb-2 px-1 text-[11px] font-medium tracking-wide uppercase">
                            {t('hintsLabel')}
                        </p>
                        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {hints.map(({ key, label, Icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => void onHint(key)}
                                    className={cn(
                                        'bg-muted/80 text-foreground inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px]',
                                        'hover:bg-accent active:scale-[0.97] transition-colors'
                                    )}
                                >
                                    <span className="bg-card text-sage flex size-6 items-center justify-center rounded-full">
                                        <Icon size={13} strokeWidth={2} />
                                    </span>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Surface
                frost
                capsule
                className={cn('overflow-hidden', isWriting && 'flex min-h-0 flex-1 flex-col')}
            >
                <AnimatePresence>
                    {attachments.length > 0 && (
                        <div className="border-hairline flex shrink-0 flex-wrap gap-2 border-b px-3 pt-3 pb-2">
                            {attachments.map((a) => (
                                <span
                                    key={a.id}
                                    className="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
                                >
                                    {a.kind === 'geo' ? (
                                        <MapPin size={12} className="text-sage" />
                                    ) : a.kind === 'voice' ? (
                                        <Mic size={12} className="text-sage" />
                                    ) : (
                                        <FileIcon size={12} className="text-sage" />
                                    )}
                                    {a.name}
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(a.id)}
                                        aria-label="remove"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {(showRelations || people.length > 0 || places.length > 0) && (
                    <div className="border-hairline flex shrink-0 flex-col gap-3 border-b px-3 py-3">
                        <PeoplePicker value={people} onChange={setPeople} />
                        <PlacesPicker
                            value={places}
                            onChange={setPlaces}
                            max={Math.max(0, 3 - locationCount)}
                        />
                    </div>
                )}

                <div className={cn(isWriting && 'min-h-0 flex-1 overflow-y-auto')}>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder={t('composerPlaceholder')}
                        canvas={isWriting}
                        minHeight={isWriting ? 220 : 48}
                        onFocus={() => setFocused(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape' && !hasText && attachments.length === 0) {
                                ;(e.target as HTMLElement).blur()
                                setFocused(false)
                                return
                            }
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault()
                                void onSubmit()
                            }
                        }}
                    />
                </div>

                <div className="flex shrink-0 items-center justify-between gap-2 px-2 pb-2">
                    <div className="flex items-center gap-0.5">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files ?? [])
                                e.target.value = ''
                                const room = 5 - mediaCount
                                if (room <= 0) {
                                    toast.error(t('mediaLimit'))
                                    return
                                }
                                files.slice(0, room).forEach((file) => {
                                    addAttachment({
                                        id: crypto.randomUUID(),
                                        kind: 'media',
                                        file,
                                        name: file.name
                                    })
                                })
                                if (files.length > room) toast.error(t('mediaLimit'))
                            }}
                        />
                        <input
                            ref={audioRef}
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                e.target.value = ''
                                if (!file) return
                                if (hasText) {
                                    toast.error(t('voiceXorText'))
                                    return
                                }
                                if (hasVoice) {
                                    toast.error(t('voiceOneOnly'))
                                    return
                                }
                                addAttachment({
                                    id: crypto.randomUUID(),
                                    kind: 'voice',
                                    file,
                                    name: file.name
                                })
                            }}
                        />
                        <Menu shadow="sm" width={180} position="top-start">
                            <Menu.Target>
                                <Tooltip label={t('attach')}>
                                    <IconButton aria-label={t('attach')}>
                                        <Paperclip size={18} />
                                    </IconButton>
                                </Tooltip>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<FileIcon size={14} />}
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {t('attachFile')}
                                </Menu.Item>
                                <Menu.Item leftSection={<MapPin size={14} />} onClick={() => void onHint('geo')}>
                                    {t('attachGeo')}
                                </Menu.Item>
                                <Menu.Item leftSection={<Users size={14} />} onClick={() => void onHint('people')}>
                                    {t('hintPeople')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        <Tooltip label={recording ? t('voiceStop') : t('voice')}>
                            <IconButton
                                aria-label={t('voice')}
                                onClick={() => (recording ? stopRecording() : void onHint('voice'))}
                            >
                                {recording ? <Square size={16} className="text-red-500" /> : <Mic size={18} />}
                            </IconButton>
                        </Tooltip>
                    </div>

                    <Tooltip label={t('send')}>
                        <IconButton
                            tone="primary"
                            disabled={!canSend}
                            loading={busy}
                            onClick={() => void onSubmit()}
                            aria-label={t('send')}
                            className="rounded-full!"
                        >
                            <ArrowUp size={18} />
                        </IconButton>
                    </Tooltip>
                </div>
            </Surface>
        </motion.div>
    )
}

export default CreateNoteForm
