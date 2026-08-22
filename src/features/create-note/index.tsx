'use client'

import { useCreateNote } from '@/entities/note/api/use-create-note'
import { NoteAttachment, NoteAttachmentType } from '@/entities/note/model'
import { ActionIcon, Menu, Textarea, Tooltip } from '@mantine/core'
import { ArrowUp, FileAudio, FileIcon, MapPin, Mic, Paperclip, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export const CreateNoteForm = () => {
    const t = useTranslations('home')
    const [content, setContent] = useState('')
    const [attachments, setAttachments] = useState<NoteAttachment[]>([])
    const fileRef = useRef<HTMLInputElement>(null)
    const { mutate: createNote, isPending } = useCreateNote()

    const canSend = content.trim().length > 0 || attachments.length > 0

    const addAttachment = (partial: Omit<NoteAttachment, 'id'>) => {
        setAttachments((prev) => [...prev, { ...partial, id: crypto.randomUUID() }])
    }

    const removeAttachment = (id: string) => {
        setAttachments((prev) => prev.filter((a) => a.id !== id))
    }

    const onSubmit = () => {
        if (!canSend || isPending) return
        createNote(
            { content: content.trim() || ' ', attachments },
            {
                onSuccess: () => {
                    setContent('')
                    setAttachments([])
                }
            }
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="border-border bg-card w-full rounded-2xl border shadow-sm"
        >
            <AnimatePresence>
                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-3 pt-3 pb-2">
                        {attachments.map((a) => (
                            <span
                                key={a.id}
                                className="bg-muted text-foreground inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
                            >
                                {a.type === NoteAttachmentType.MUSIC && <FileAudio size={12} />}
                                {a.type === NoteAttachmentType.GEO && <MapPin size={12} />}
                                {a.type === NoteAttachmentType.FILE && <FileIcon size={12} />}
                                {a.name ?? a.type}
                                <button type="button" onClick={() => removeAttachment(a.id)} aria-label="remove">
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
                variant="unstyled"
                classNames={{
                    input: 'px-4! py-3! text-[15px] leading-relaxed!'
                }}
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
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            addAttachment({ type: NoteAttachmentType.FILE, name: file.name })
                            e.target.value = ''
                        }}
                    />
                    <Menu shadow="sm" width={180} position="top-start">
                        <Menu.Target>
                            <Tooltip label={t('attach')}>
                                <ActionIcon variant="subtle" color="gray" size="lg" aria-label={t('attach')}>
                                    <Paperclip size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item leftSection={<FileIcon size={14} />} onClick={() => fileRef.current?.click()}>
                                {t('attachFile')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<FileAudio size={14} />}
                                onClick={() => addAttachment({ type: NoteAttachmentType.MUSIC, name: 'Track' })}
                            >
                                {t('attachMusic')}
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<MapPin size={14} />}
                                onClick={() =>
                                    addAttachment({
                                        type: NoteAttachmentType.GEO,
                                        name: 'Место',
                                        meta: { lat: 55.75, lng: 37.62, label: 'Здесь' }
                                    })
                                }
                            >
                                {t('attachGeo')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    <Tooltip label={t('voiceSoon')}>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="lg"
                            aria-label={t('voice')}
                            onClick={() => toast(t('voiceSoon'))}
                        >
                            <Mic size={18} />
                        </ActionIcon>
                    </Tooltip>
                </div>

                <Tooltip label={t('send')}>
                    <ActionIcon
                        size="lg"
                        radius="xl"
                        variant="filled"
                        color="brandColors"
                        disabled={!canSend}
                        loading={isPending}
                        onClick={onSubmit}
                        aria-label={t('send')}
                    >
                        <ArrowUp size={18} />
                    </ActionIcon>
                </Tooltip>
            </div>
        </motion.div>
    )
}

export default CreateNoteForm
