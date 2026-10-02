'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { PenLine, Sparkles } from 'lucide-react'
import CreateNoteForm from '@/features/create-note'
import { AskNotesPanel, useAskNotesStore, type HomeComposerMode } from '@/features/ask-notes'
import { TodaySummary } from '@/widgets/today-summary'
import { SegmentedControl } from '@/shared/ui'
import { cn } from '@/shared/utils'

const HomePage = () => {
    const t = useTranslations('home')
    const [isWriting, setIsWriting] = useState(false)
    const [askBusy, setAskBusy] = useState(false)
    const mode = useAskNotesStore((s) => s.mode)
    const setMode = useAskNotesStore((s) => s.setMode)

    const expanded = mode === 'ask' || isWriting

    return (
        <div
            className={cn(
                'mx-auto flex w-full flex-1 flex-col px-4 pt-5 pb-4 md:w-4/5 md:px-6 md:pt-8',
                expanded && 'min-h-0'
            )}
        >
            <AnimatePresence initial={false}>
                {mode === 'write' && !isWriting && (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                        className="overflow-hidden"
                    >
                        <TodaySummary />
                    </motion.div>
                )}
            </AnimatePresence>

            {mode === 'write' && !isWriting && <div className="flex-1" />}

            <div
                className={cn(
                    'pb-[env(safe-area-inset-bottom)]',
                    expanded
                        ? 'flex min-h-0 flex-1 flex-col pt-2'
                        : 'border-hairline bg-surface-frost/75 sticky bottom-3 mt-5 rounded-[22px] border p-2 shadow-[0_12px_36px_color-mix(in_srgb,var(--foreground)_6%,transparent)] backdrop-blur-xl md:bottom-5'
                )}
            >
                <SegmentedControl
                    value={mode}
                    onChange={(value) => {
                        if (askBusy && value === 'write') return
                        setMode(value as HomeComposerMode)
                    }}
                    className={cn('mb-2 shrink-0', !expanded && 'bg-muted/70')}
                    options={[
                        { value: 'write', label: t('mode.write') },
                        { value: 'ask', label: t('mode.ask') }
                    ]}
                    renderOption={(option, active) => {
                        const Icon = option.value === 'ask' ? Sparkles : PenLine
                        return (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => {
                                    if (askBusy && option.value === 'write') return
                                    setMode(option.value as HomeComposerMode)
                                }}
                                className={cn(
                                    'flex w-full items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium transition-[background-color,color,transform] duration-150',
                                    'active:scale-[0.97]',
                                    active
                                        ? 'bg-card text-foreground shadow-[0_1px_2px_color-mix(in_srgb,var(--foreground)_8%,transparent)]'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Icon
                                    size={15}
                                    strokeWidth={1.75}
                                    className={cn(active && option.value === 'ask' && 'text-primary')}
                                />
                                {option.label}
                            </button>
                        )
                    }}
                />

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.32 }}
                        className={cn(expanded ? 'flex min-h-0 flex-1 flex-col' : undefined)}
                    >
                        {mode === 'write' ? (
                            <CreateNoteForm onWritingChange={setIsWriting} />
                        ) : (
                            <AskNotesPanel onBusyChange={setAskBusy} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default HomePage
