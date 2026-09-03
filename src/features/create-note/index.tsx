'use client'

import { useCreateEntry } from '@/entities/entry/api/use-create-entry'
import { EntryLocationInput } from '@/entities/entry/api/create-entry-request'
import { IconButton, Surface, Textarea } from '@/shared/ui'
import { Menu, Tooltip } from '@mantine/core'
import { ArrowUp, FileIcon, MapPin, Mic, Paperclip, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/utils'

type HintKey = 'file' | 'geo' | 'voice'

type PendingAttachment =
    | { id: string; kind: 'photo'; file: File; name: string }
    | { id: string; kind: 'geo'; name: string; location: EntryLocationInput }

export const CreateNoteForm = () => {
    const t = useTranslations('home')
    const [content, setContent] = useState('')
    const [attachments, setAttachments] = useState<PendingAttachment[]>([])
    const fileRef = useRef<HTMLInputElement>(null)
    const { mutate: createEntry, isPending } = useCreateEntry()

    const canSend = content.trim().length > 0 || attachments.length > 0
    const showHints = !content.trim() && attachments.length === 0

    const addAttachment = (attachment: PendingAttachment) => {
        setAttachments((prev) => [...prev, attachment])
    }

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id))
    }

    const onHint = (key: HintKey) => {
        if (key === 'file') {
            fileRef.current?.click()
            return
        }
        if (key === 'geo') {
            addAttachment({
                id: crypto.randomUUID(),
                kind: 'geo',
                name: t('hintGeo'),
                location: { latitude: 55.75, longitude: 37.62, locationLabel: t('hintGeo') }
            })
            return
        }
        toast(t('voiceSoon'))
    }

    const onSubmit = () => {
        if (!canSend || isPending) return

        const photos = attachments.filter((item): item is Extract<PendingAttachment, { kind: 'photo' }> => item.kind === 'photo')
        const locations = attachments
            .filter((item): item is Extract<PendingAttachment, { kind: 'geo' }> => item.kind === 'geo')
            .map((item) => item.location)

        createEntry(
            {
                text: content.trim() || undefined,
                photos: photos.map((item) => item.file),
                location: locations.length ? locations : undefined
            },
            {
                onSuccess: () => {
                    setContent('')
                    setAttachments([])
                }
            }
        )
    }

    const hints: { key: HintKey; label: string; Icon: typeof FileIcon }[] = [
        { key: 'file', label: t('hintFile'), Icon: FileIcon },
        { key: 'geo', label: t('hintGeo'), Icon: MapPin },
        { key: 'voice', label: t('hintVoice'), Icon: Mic }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="flex flex-col gap-3"
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
                                    onClick={() => onHint(key)}
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

            <Surface frost capsule className="overflow-hidden">
                <AnimatePresence>
                    {attachments.length > 0 && (
                        <div className="border-hairline flex flex-wrap gap-2 border-b px-3 pt-3 pb-2">
                            {attachments.map((a) => (
                                <span
                                    key={a.id}
                                    className="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
                                >
                                    {a.kind === 'geo' ? (
                                        <MapPin size={12} className="text-sage" />
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

                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.currentTarget.value)}
                    placeholder={t('composerPlaceholder')}
                    minRows={2}
                    maxRows={8}
                    autosize
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault()
                            onSubmit()
                        }
                    }}
                />

                <div className="flex items-center justify-between gap-2 px-2 pb-2">
                    <div className="flex items-center gap-0.5">
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                addAttachment({
                                    id: crypto.randomUUID(),
                                    kind: 'photo',
                                    file,
                                    name: file.name
                                })
                                e.target.value = ''
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
                                <Menu.Item leftSection={<MapPin size={14} />} onClick={() => onHint('geo')}>
                                    {t('attachGeo')}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        <Tooltip label={t('voiceSoon')}>
                            <IconButton aria-label={t('voice')} onClick={() => onHint('voice')}>
                                <Mic size={18} />
                            </IconButton>
                        </Tooltip>
                    </div>

                    <Tooltip label={t('send')}>
                        <IconButton
                            tone="primary"
                            disabled={!canSend}
                            loading={isPending}
                            onClick={onSubmit}
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
