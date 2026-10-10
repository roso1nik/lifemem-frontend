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
                        : 'sticky bottom-3 mt-5 md:bottom-5'
                )}
            >
                <div
                    className={cn(
                        'relative',
                        expanded
                            ? 'flex min-h-0 flex-1 flex-col'
                            : cn(
                                  'border-hairline overflow-hidden rounded-[26px] border p-2.5',
                                  'bg-surface-frost/80 shadow-[0_16px_48px_color-mix(in_srgb,var(--foreground)_7%,transparent),0_0_0_1px_color-mix(in_srgb,var(--primary)_8%,transparent)]',
                                  'backdrop-blur-xl'
                              )
                    )}
                >
                    {!expanded && (
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
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
                            <p className="text-muted-foreground mb-2 px-1 text-[11px] font-medium tracking-wide uppercase">
                                {t('composer.writeKicker')}
                            </p>
                        )}

                        <SegmentedControl
                            value={mode}
                            onChange={(value) => {
                                if (askBusy && value === 'write') return
                                setMode(value as HomeComposerMode)
                            }}
                            className={cn(
                                'mb-2.5 shrink-0',
                                !expanded && 'border-hairline bg-card/70 border shadow-sm'
                            )}
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
                                            'flex w-full items-center justify-center gap-2 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-[background-color,color,transform,box-shadow] duration-150',
                                            'active:scale-[0.97]',
                                            active
                                                ? option.value === 'ask'
                                                    ? 'bg-primary text-primary-foreground shadow-[0_6px_16px_color-mix(in_srgb,var(--primary)_28%,transparent)]'
                                                    : 'bg-card text-foreground shadow-[0_1px_2px_color-mix(in_srgb,var(--foreground)_8%,transparent)]'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <Icon size={15} strokeWidth={1.75} />
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
