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

const SUGGESTION_KEYS = ['week', 'people', 'places'] as const

const SourceRow = ({
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
            className={cn(
                'hover:bg-muted/50 flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left',
                'transition-[background-color,transform] duration-100 active:scale-[0.98]'
            )}
        >
            <span className="bg-sage/15 text-sage mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <FileIcon size={14} strokeWidth={1.75} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="text-foreground block truncate text-[13px] font-medium tracking-tight">
                    {source.title}
                </span>
                {preview && preview !== source.title && (
                    <span className="text-muted-foreground mt-0.5 line-clamp-2 block text-xs leading-snug">
                        {preview}
                    </span>
                )}
                <span className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-2 text-[11px] tabular-nums">
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
                </span>
            </span>
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
    const showEmpty = !data && !busy

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

    const onSubmit = (value?: string) => {
        const next = (value ?? question).trim()
        if (!next || busy) return
        setQuestion(next)
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
        <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="min-h-0 flex-1 overflow-y-auto px-0.5">
                <AnimatePresence mode="wait" initial={false}>
                    {showEmpty && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                            className="flex flex-col px-1 py-6"
                        >
                            <div className="flex flex-col items-center gap-3 text-center">
                                <span className="bg-primary/12 text-primary shadow-[0_10px_28px_color-mix(in_srgb,var(--primary)_14%,transparent)] flex size-14 items-center justify-center rounded-[18px]">
                                    <Sparkles size={22} strokeWidth={1.6} />
                                </span>
                                <div>
                                    <p className="text-foreground text-lg font-semibold tracking-tight">
                                        {t('ask.emptyTitle')}
                                    </p>
                                    <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">
                                        {t('ask.emptyHint')}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-7 flex flex-col gap-2">
                                <p className="text-muted-foreground px-0.5 text-[11px] font-medium tracking-wide uppercase">
                                    {t('ask.suggestionsLabel')}
                                </p>
                                <div className="flex flex-col gap-2">
                                    {SUGGESTION_KEYS.map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => onSubmit(t(`ask.suggestions.${key}`))}
                                            className={cn(
                                                'border-hairline bg-surface-frost/50 hover:bg-muted/50 w-full rounded-2xl border px-3.5 py-3 text-left text-[13px] leading-snug',
                                                'active:scale-[0.98] transition-[transform,background-color] duration-100'
                                            )}
                                        >
                                            {t(`ask.suggestions.${key}`)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {busy && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-3 px-1 py-4"
                        >
                            {lastQuestion && (
                                <p className="text-muted-foreground text-sm leading-snug">{lastQuestion}</p>
                            )}
                            <Surface frost capsule className="animate-pulse p-4">
                                <div className="bg-muted/60 h-3 w-20 rounded" />
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
                                    <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                                        {t('ask.questionLabel')}
                                    </p>
                                    <p className="text-foreground mt-1 text-sm font-medium leading-snug">
                                        {lastQuestion}
                                    </p>
                                </div>
                            )}

                            <Surface frost capsule className="border-primary/15 border-l-[3px] px-4 py-4 sm:px-5">
                                <p className="text-primary text-[11px] font-semibold tracking-wide uppercase">
                                    {t('ask.answerLabel')}
                                </p>
                                <p className="text-foreground mt-2 text-[15px] leading-relaxed tracking-tight sm:text-base">
                                    {data.answer}
                                </p>
                            </Surface>

                            {data.sources.length > 0 && (
                                <Surface frost capsule className="overflow-hidden p-1.5">
                                    <p className="text-muted-foreground px-2.5 pt-2 pb-1 text-[11px] font-medium tracking-wide uppercase">
                                        {t('ask.sourcesLabel', { count: data.sources.length })}
                                    </p>
                                    <ul className="divide-hairline flex flex-col divide-y">
                                        {data.sources.map((source) => (
                                            <li key={source.id}>
                                                <SourceRow source={source} onSelect={onSelectSource} />
                                            </li>
                                        ))}
                                    </ul>
                                </Surface>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Surface frost capsule className="shrink-0 overflow-hidden">
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
                        onClick={() => onSubmit()}
                        className="mb-0.5 shrink-0 rounded-full!"
                    >
                        <ArrowUp size={18} strokeWidth={2} />
                    </IconButton>
                </div>
            </Surface>
        </div>
    )
}
