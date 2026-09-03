'use client'

import { useEntryById } from '@/entities/entry/api/use-entries'
import { getEntryPreviewText } from '@/entities/entry/model'
import { Surface } from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'
import { useTranslations } from 'next-intl'

type NoteDetailProps = {
    noteId: string
}

export const NoteDetail = ({ noteId }: NoteDetailProps) => {
    const t = useTranslations('home')
    const entry = useEntryById(noteId)
    const preview = entry ? getEntryPreviewText(entry) : ''

    return (
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-8 md:w-4/5 md:px-6">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {entry ? dayjsInstance(entry.createdAt).format('D MMMM YYYY · HH:mm') : '—'}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {preview.slice(0, 80) || t('tabNoteMissing')}
            </h1>
            <Surface className="mt-6 p-5">
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {preview || t('tabNoteMissing')}
                </p>
                {entry && (entry.images.length > 0 || entry.places.length > 0 || entry.isHasVoice) && (
                    <div className="border-hairline mt-4 flex flex-wrap gap-2 border-t pt-4">
                        {entry.images.map((image) => (
                            <span
                                key={image.id}
                                className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs"
                            >
                                {image.url || image.fileId}
                            </span>
                        ))}
                        {entry.isHasVoice && (
                            <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs">
                                voice
                            </span>
                        )}
                        {entry.places.map((place) => (
                            <span
                                key={place.id}
                                className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs"
                            >
                                {place.name}
                            </span>
                        ))}
                    </div>
                )}
            </Surface>
        </div>
    )
}
