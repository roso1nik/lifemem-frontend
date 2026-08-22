'use client'

import { Note, NoteAttachmentType } from '@/entities/note/model'
import { FileAudio, FileIcon, MapPin, Mic } from 'lucide-react'
import { dayjsInstance, cn } from '@/shared/utils'

const AttachmentIcon = ({ type }: { type: Note['attachments'][number]['type'] }) => {
    if (type === NoteAttachmentType.MUSIC) return <FileAudio size={12} />
    if (type === NoteAttachmentType.GEO) return <MapPin size={12} />
    if (type === NoteAttachmentType.VOICE) return <Mic size={12} />
    return <FileIcon size={12} />
}

export type NoteCardProps = {
    note: Note
    selected?: boolean
    onSelect?: (note: Note) => void
}

export const NoteCard = ({ note, selected, onSelect }: NoteCardProps) => {
    return (
        <button
            type="button"
            onClick={() => onSelect?.(note)}
            className={cn(
                'w-full cursor-pointer rounded-xl px-3 py-2.5 text-left transition-colors',
                'hover:bg-sidebar-accent active:scale-[0.99]',
                selected && 'bg-sidebar-accent'
            )}
        >
            <p className="text-foreground line-clamp-2 text-sm leading-snug">{note.content}</p>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="text-muted-foreground text-[11px] tabular-nums">
                    {dayjsInstance(note.createdAt).format('HH:mm')}
                </span>
                {note.attachments.length > 0 && (
                    <span className="text-muted-foreground flex items-center gap-1">
                        {note.attachments.slice(0, 3).map((a) => (
                            <span key={a.id} title={a.name} className="text-sage">
                                <AttachmentIcon type={a.type} />
                            </span>
                        ))}
                    </span>
                )}
            </div>
        </button>
    )
}
