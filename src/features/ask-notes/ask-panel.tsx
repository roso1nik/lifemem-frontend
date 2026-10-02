'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, FileIcon, MapPin, Mic, Sparkles, Users } from 'lucide-react'
import { useAskEntry, type EntryRagSource } from '@/entities/entry/api/use-ask-entry'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import { IconButton, Surface } from '@/shared/ui'
import { cn, dayjsInstance } from '@/shared/utils'
import { useAskNotesStore } from './store'

const SourceCard = ({
    source,
    onSelect
}: {
    source: EntryRagSource
    onSelect: (source: EntryRagSource) => void
}) => {
    const preview = source.textSnippet?.trim() || source.title

    return (
        <button
            type="button"
            onClick={() => onSelect(source)}
            className="border-hairline hover:bg-muted/40 w-full rounded-[var(--radius-card)] border px-3 py-3 text-left transition-transform active:scale-[0.97]"
        >
            <p className="text-sage text-[11px] font-semibold tracking-tight">{source.title}</p>
            {preview && preview !== source.title && (
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">{preview}</p>
            )}
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-[11px] tabular-nums">
                <span>{dayjsInstance(source.createdAt).format('D MMM, HH:mm')}</span>
                {source.mediaCount > 0 && (
                    <span className="text-sage inline-flex items-center gap-0.5">
                        <FileIcon size={11} />
                        {source.mediaCount}
                    </span>
                )}
                {source.isHasVoice && (
                    <span className="text-sage">
                        <Mic size={11} />
                    </span>
                )}
                {source.peopleCount > 0 && (
                    <span className="text-sage inline-flex items-center gap-0.5">
                        <Users size={11} />
                        {source.peopleCount}
                    </span>
                )}
                {source.placesCount > 0 && (
                    <span className="text-sage inline-flex items-center gap-0.5">
                        <MapPin size={11} />
                        {source.placesCount}
                    </span>
                )}
            </div>
        </button>
    )
}

export type AskNotesPanelProps = {
    onBusyChange?: (busy: boolean) => void
}

export const AskNotesPanel = ({ onBusyChange }: AskNotesPanelProps) => {
    const t = useTranslations('home')
    const { goNote } = useWorkspaceNavigation()
    const consumePendingQuestion = useAskNotesStore((s) => s.consumePendingQuestion)
    const pendingQuestion = useAskNotesStore((s) => s.pendingQuestion)
    const [question, setQuestion] = useState('')
    const [lastQuestion, setLastQuestion] = useState('')
    const { mutate: ask, data, isPending, reset } = useAskEntry()

    const busy = isPending
    const canSend = question.trim().length > 0 && !busy

    useEffect(() => {
        onBusyChange?.(busy)
    }, [busy, onBusyChange])

    useEffect(() => {
        if (!pendingQuestion) return
        const pending = consumePendingQuestion()
        if (!pending) return
        setQuestion(pending)
        setLastQuestion(pending)
        ask({ question: pending })
    }, [pendingQuestion, ask, consumePendingQuestion])

    const onSubmit = () => {
        const next = question.trim()
        if (!next || busy) return
        setLastQuestion(next)
        ask({ question: next })
    }

    const onSelectSource = (source: EntryRagSource) => {
        goNote({
            id: source.id,
            title: source.title.slice(0, 28) || t('tab.notes')
        })
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="min-h-0 flex-1 overflow-y-auto px-1">
                <AnimatePresence mode="wait" initial={false}>
                    {!data && !busy && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                            className="flex flex-col items-center gap-3 px-4 py-10 text-center"
                        >
                            <span className="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-full">
                                <Sparkles size={18} strokeWidth={1.75} />
                            </span>
                            <div>
                                <p className="text-foreground text-base font-semibold tracking-tight">
                                    {t('ask.emptyTitle')}
                                </p>
                                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                    {t('ask.emptyHint')}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {busy && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-3 px-1 py-6"
                        >
                            {lastQuestion && (
                                <p className="text-muted-foreground text-sm">{lastQuestion}</p>
                            )}
                            <Surface frost className="animate-pulse p-4">
                                <div className="bg-muted/60 h-3 w-24 rounded" />
                                <div className="bg-muted/50 mt-3 h-4 w-full rounded" />
                                <div className="bg-muted/40 mt-2 h-4 w-4/5 rounded" />
                                <div className="bg-muted/40 mt-2 h-4 w-2/3 rounded" />
                            </Surface>
                        </motion.div>
                    )}

                    {data && !busy && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                            className="flex flex-col gap-4 pb-2"
                        >
                            {lastQuestion && (
                                <div className="px-1">
                                    <p className="text-muted-foreground text-[11px] font-medium tracking-tight uppercase">
                                        {t('ask.questionLabel')}
                                    </p>
                                    <p className="text-foreground mt-1 text-sm font-medium leading-snug">
                                        {lastQuestion}
                                    </p>
                                </div>
                            )}

                            <Surface
                                frost
                                className="border-primary/20 border-l-[3px] px-4 py-4 sm:px-5"
                            >
                                <p className="text-primary text-[11px] font-semibold tracking-tight">
                                    {t('ask.answerLabel')}
                                </p>
                                <p className="text-foreground mt-2 text-[15px] leading-relaxed tracking-tight sm:text-base">
                                    {data.answer}
                                </p>
                            </Surface>

                            {data.sources.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-muted-foreground px-1 text-[11px] font-medium tracking-tight uppercase">
                                        {t('ask.sourcesLabel', { count: data.sources.length })}
                                    </p>
                                    <ul className="flex flex-col gap-2">
                                        {data.sources.map((source) => (
                                            <li key={source.id}>
                                                <SourceCard source={source} onSelect={onSelectSource} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Surface frost className="shrink-0 overflow-hidden">
                <div className="flex items-end gap-2 px-2 py-2">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t('ask.placeholder')}
                        rows={1}
                        disabled={busy}
                        className={cn(
                            'text-foreground placeholder:text-muted-foreground max-h-32 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-snug outline-none',
                            'disabled:opacity-60'
                        )}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                onSubmit()
                            }
                            if (e.key === 'Escape' && data) {
                                reset()
                                setLastQuestion('')
                            }
                        }}
                    />
                    <IconButton
                        type="button"
                        tone="primary"
                        aria-label={t('ask.submit')}
                        disabled={!canSend}
                        loading={busy}
                        onClick={onSubmit}
                        className="mb-0.5 shrink-0"
                    >
                        <ArrowUp size={18} strokeWidth={2} />
                    </IconButton>
                </div>
            </Surface>
        </div>
    )
}
