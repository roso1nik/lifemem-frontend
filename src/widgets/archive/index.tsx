'use client'

import { useEffect, useState } from 'react'
import { Archive } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { SegmentedControl, TextInput } from '@/shared/ui'
import { ArchiveUsers } from './archive-users'
import { ArchivePlaces } from './archive-places'

type ArchiveTab = 'people' | 'places'

export const ArchivePage = () => {
    const tHome = useTranslations('home')
    const t = useTranslations('home.archive')
    const [tab, setTab] = useState<ArchiveTab>('people')
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(search.trim(), 300)

    useEffect(() => {
        setSearch('')
    }, [tab])

    return (
        <div className="flex w-full flex-1 flex-col px-4 py-10 md:px-6">
            <span className="bg-accent text-primary flex size-11 items-center justify-center rounded-2xl">
                <Archive size={22} />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">{tHome('tab.archive')}</h1>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                {tHome('sectionArchiveBody')}
            </p>

            <div className="mt-8 flex w-full flex-col gap-4">
                <SegmentedControl
                    value={tab}
                    onChange={setTab}
                    options={[
                        { value: 'people', label: t('people') },
                        { value: 'places', label: t('places') }
                    ]}
                />

                <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder={tab === 'people' ? t('searchPeople') : t('searchPlaces')}
                    aria-label={tab === 'people' ? t('searchPeople') : t('searchPlaces')}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                        className="min-h-0 w-full"
                    >
                        {tab === 'people' ? (
                            <ArchiveUsers query={debouncedSearch} />
                        ) : (
                            <ArchivePlaces query={debouncedSearch} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
