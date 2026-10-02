'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import CreateNoteForm from '@/features/create-note'
import { AskNotesPanel, useAskNotesStore } from '@/features/ask-notes'
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
                'mx-auto flex w-full flex-1 flex-col px-4 pt-6 pb-4 md:w-4/5 md:px-6 md:pt-10',
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
                        : 'sticky bottom-4 mt-6 md:bottom-6'
                )}
            >
                <SegmentedControl
                    value={mode}
                    onChange={(value) => {
                        if (askBusy && value === 'write') return
                        setMode(value)
                    }}
                    className="mb-3 shrink-0"
                    options={[
                        { value: 'write', label: t('mode.write') },
                        { value: 'ask', label: t('mode.ask') }
                    ]}
                />

                {mode === 'write' ? (
                    <CreateNoteForm onWritingChange={setIsWriting} />
                ) : (
                    <AskNotesPanel onBusyChange={setAskBusy} />
                )}
            </div>
        </div>
    )
}

export default HomePage
