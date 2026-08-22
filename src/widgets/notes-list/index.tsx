'use client'

import { useNotesGroupedByDay } from '@/entities/note/api/use-notes'
import { Note, NoteAttachmentType } from '@/entities/note/model'
import { FileAudio, FileIcon, MapPin, Mic } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { dayjsInstance } from '@/shared/utils'
import { cn } from '@/shared/utils'

const AttachmentIcon = ({ type }: { type: Note['attachments'][number]['type'] }) => {
    if (type === NoteAttachmentType.MUSIC) return <FileAudio size={12} />
    if (type === NoteAttachmentType.GEO) return <MapPin size={12} />
    if (type === NoteAttachmentType.VOICE) return <Mic size={12} />
    return <FileIcon size={12} />
}

interface NotesListProps {
    onSelect?: (note: Note) => void
    selectedId?: string | null
}

export const NotesList = ({ onSelect, selectedId }: NotesListProps) => {
    const groups = useNotesGroupedByDay()
    const t = useTranslations('home')

    if (groups.length === 0) {
        return <p className="text-muted-foreground p-4 text-sm">{t('noNotes')}</p>
    }

    return (
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
            {groups.map((group, gi) => (
                <motion.section
                    key={group.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.04, duration: 0.25 }}
                >
                    <h3 className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">
                        {group.label}
                    </h3>
                    <ul className="flex flex-col gap-0.5">
                        {group.notes.map((note) => (
                            <li key={note.id}>
                                <button
                                    type="button"
                                    onClick={() => onSelect?.(note)}
                                    className={cn(
                                        'hover:bg-sidebar-accent w-full rounded-xl px-3 py-2.5 text-left transition-colors',
                                        selectedId === note.id && 'bg-sidebar-accent'
                                    )}
                                >
                                    <p className="line-clamp-2 text-sm leading-snug">{note.content}</p>
                                    <div className="mt-1.5 flex items-center gap-2">
                                        <span className="text-muted-foreground text-[11px]">
                                            {dayjsInstance(note.createdAt).format('HH:mm')}
                                        </span>
                                        {note.attachments.length > 0 && (
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                {note.attachments.slice(0, 3).map((a) => (
                                                    <span key={a.id} title={a.name}>
                                                        <AttachmentIcon type={a.type} />
                                                    </span>
                                                ))}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </motion.section>
            ))}
        </div>
    )
}
