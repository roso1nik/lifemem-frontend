'use client'

import { useTodayNotesCount } from '@/entities/note/api/use-notes'
import { dayjsInstance } from '@/shared/utils'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export const TodaySummary = () => {
    const t = useTranslations('home')
    const count = useTodayNotesCount()
    const today = dayjsInstance()

    return (
        <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="px-1 pb-4"
        >
            <p className="text-muted-foreground text-sm capitalize">{today.format('dddd')}</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight md:text-3xl">
                {today.format('D MMMM')}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">{t('notesToday', { count })}</p>
            {count === 0 && <p className="text-muted-foreground mt-1 text-sm">{t('emptyDay')}</p>}
        </motion.header>
    )
}
