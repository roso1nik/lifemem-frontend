'use client'

import { Entry, getEntryAttachmentCount, getEntryPreviewText } from '@/entities/entry/model'
import { FileIcon, MapPin, Mic } from 'lucide-react'
import { dayjsInstance, cn } from '@/shared/utils'

export type EntryCardProps = {
    entry: Entry
    selected?: boolean
    onSelect?: (entry: Entry) => void
}

export const EntryCard = ({ entry, selected, onSelect }: EntryCardProps) => {
    const attachmentCount = getEntryAttachmentCount(entry)

    return (
        <button
            type="button"
            onClick={() => onSelect?.(entry)}
            className={cn(
                'w-full cursor-pointer rounded-xl px-3 py-2.5 text-left transition-colors',
                'hover:bg-sidebar-accent active:scale-[0.99]',
                selected && 'bg-sidebar-accent'
            )}
        >
            <p className="text-foreground line-clamp-2 text-sm leading-snug">{getEntryPreviewText(entry)}</p>
            <div className="mt-1.5 flex items-center gap-2">
                <span className="text-muted-foreground text-[11px] tabular-nums">
                    {dayjsInstance(entry.createdAt).format('HH:mm')}
                </span>
                {attachmentCount > 0 && (
                    <span className="text-muted-foreground flex items-center gap-1">
                        {entry.images.slice(0, 2).map((image) => (
                            <span key={image.id} title={image.url} className="text-sage">
                                <FileIcon size={12} />
                            </span>
                        ))}
                        {entry.isHasVoice && (
                            <span className="text-sage">
                                <Mic size={12} />
                            </span>
                        )}
                        {entry.places.length > 0 && (
                            <span className="text-sage">
                                <MapPin size={12} />
                            </span>
                        )}
                    </span>
                )}
            </div>
        </button>
    )
}
