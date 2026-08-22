'use client'

import { useNotesStore } from '@/entities/note/store/notes-store'
import { Surface } from '@/shared/ui'
import { dayjsInstance } from '@/shared/utils'
import { useTranslations } from 'next-intl'

type NoteDetailProps = {
    noteId: string
}

export const NoteDetail = ({ noteId }: NoteDetailProps) => {
    const t = useTranslations('home')
    const note = useNotesStore((s) => s.notes.find((n) => n.id === noteId))

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 md:px-6">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {note ? dayjsInstance(note.createdAt).format('D MMMM YYYY · HH:mm') : '—'}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {note?.content.slice(0, 80) || t('tabNoteMissing')}
            </h1>
            <Surface className="mt-6 p-5">
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {note?.content ?? t('tabNoteMissing')}
                </p>
                {note && note.attachments.length > 0 && (
                    <div className="border-hairline mt-4 flex flex-wrap gap-2 border-t pt-4">
                        {note.attachments.map((a) => (
                            <span
                                key={a.id}
                                className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs"
                            >
                                {a.name ?? a.type}
                            </span>
                        ))}
                    </div>
                )}
            </Surface>
        </div>
    )
}
