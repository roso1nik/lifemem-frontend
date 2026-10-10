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
                'mx-auto flex w-full flex-1 flex-col px-2 pt-2 pb-0 md:w-4/5 md:px-6 md:pt-8 md:pb-4',
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
                        className="hidden overflow-hidden md:block"
                    >
                        <TodaySummary />
                    </motion.div>
                )}
            </AnimatePresence>

            {mode === 'write' && !isWriting && <div className="hidden flex-1 md:block" />}

            <div
                className={cn(
                    'pb-[env(safe-area-inset-bottom)]',
                    expanded
                        ? 'flex min-h-0 flex-1 flex-col pt-1 md:pt-2'
                        : 'mt-auto md:sticky md:bottom-5 md:mt-5'
                )}
            >
                <div
                    className={cn(
                        'relative',
                        expanded
                            ? 'flex min-h-0 flex-1 flex-col'
                            : cn(
                                  'border-hairline bg-surface-frost/70 overflow-hidden rounded-2xl border p-1.5 backdrop-blur-xl',
                                  'md:rounded-[26px] md:bg-surface-frost/80 md:p-2.5',
                                  'md:shadow-[0_16px_48px_color-mix(in_srgb,var(--foreground)_7%,transparent)]'
                              )
                    )}
                >
                    {!expanded && (
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 hidden md:block"
                            style={{
                                background: `
                                    radial-gradient(ellipse 80% 70% at 12% 0%, color-mix(in srgb, var(--primary) 16%, transparent), transparent 55%),
                                    radial-gradient(ellipse 60% 50% at 96% 100%, color-mix(in srgb, var(--sage) 12%, transparent), transparent 50%)
                                `
                            }}
                        />
                    )}

                    <div className={cn('relative', expanded && 'flex min-h-0 flex-1 flex-col')}>
                        {!expanded && (
                            <p className="text-muted-foreground/80 mb-1.5 hidden px-1 text-[10px] font-medium tracking-[0.08em] uppercase md:block">
                                {t('composer.writeKicker')}
                            </p>
                        )}

                        <SegmentedControl
                            value={mode}
                            onChange={(value) => {
                                if (askBusy && value === 'write') return
                                setMode(value as HomeComposerMode)
                            }}
                            className="mb-2 shrink-0 md:mb-2.5"
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
                                            'flex w-full items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-sm font-medium',
                                            'transition-[background-color,color,transform,box-shadow] duration-150',
                                            'active:scale-[0.97]',
                                            active
                                                ? 'bg-card text-foreground shadow-[0_1px_2px_color-mix(in_srgb,var(--foreground)_8%,transparent)]'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <Icon
                                            size={15}
                                            strokeWidth={1.75}
                                            className={cn(
                                                active &&
                                                    (option.value === 'ask' ? 'text-primary' : 'text-sage')
                                            )}
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
            </div>
        </div>
    )
}

export default HomePage
