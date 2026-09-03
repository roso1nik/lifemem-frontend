'use client'

import { useState } from 'react'
import CreateNoteForm from '@/features/create-note'
import { TodaySummary } from '@/widgets/today-summary'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/shared/utils'

const HomePage = () => {
    const [isWriting, setIsWriting] = useState(false)

    return (
        <div
            className={cn(
                'mx-auto flex w-full flex-1 flex-col px-4 pt-6 pb-4 md:w-4/5 md:px-6 md:pt-10',
                isWriting && 'min-h-0'
            )}
        >
            <AnimatePresence initial={false}>
                {!isWriting && (
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

            {!isWriting && <div className="flex-1" />}

            <div
                className={cn(
                    'pb-[env(safe-area-inset-bottom)]',
                    isWriting
                        ? 'flex min-h-0 flex-1 flex-col pt-2'
                        : 'sticky bottom-4 mt-6 md:bottom-6'
                )}
            >
                <CreateNoteForm onWritingChange={setIsWriting} />
            </div>
        </div>
    )
}

export default HomePage
