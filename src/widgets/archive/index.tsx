'use client'

import { useEffect, useState } from 'react'
import { Archive, MapPin, Search, Users } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { SegmentedControl, Surface, TextInput } from '@/shared/ui'
import { ArchiveUsers } from './archive-users'
import { ArchivePlaces } from './archive-places'

type ArchiveTab = 'people' | 'places'

export const ArchivePage = () => {
    const tHome = useTranslations('home')
    const t = useTranslations('home.archive')
    const reduceMotion = useReducedMotion()
    const [tab, setTab] = useState<ArchiveTab>('people')
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(search.trim(), 300)

    useEffect(() => {
        setSearch('')
    }, [tab])

    const orbTransition = reduceMotion
        ? undefined
        : { duration: 14, repeat: Infinity, ease: 'easeInOut' as const }
    const orbTransitionB = reduceMotion
        ? undefined
        : { duration: 16, repeat: Infinity, ease: 'easeInOut' as const }

    return (
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-6 md:w-4/5 md:px-6 md:py-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.45 }}
                className="relative mb-7 overflow-hidden rounded-[28px]"
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 95% 80% at 8% -10%, color-mix(in srgb, var(--primary) 34%, transparent), transparent 55%),
                            radial-gradient(ellipse 70% 70% at 92% 8%, color-mix(in srgb, var(--sage) 28%, transparent), transparent 50%),
                            radial-gradient(ellipse 55% 45% at 55% 110%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 60%),
                            linear-gradient(165deg,
                                color-mix(in srgb, var(--card) 70%, transparent),
                                color-mix(in srgb, var(--background) 35%, transparent) 55%,
                                color-mix(in srgb, var(--sage) 6%, var(--background))
                            )
                        `
                    }}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -top-8 -left-6 size-44 rounded-full opacity-50 blur-3xl"
                    style={{ background: 'color-mix(in srgb, var(--primary) 40%, transparent)' }}
                    animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, 10, 0] }}
                    transition={orbTransition}
                />
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 top-4 size-52 rounded-full opacity-40 blur-3xl"
                    style={{ background: 'color-mix(in srgb, var(--sage) 45%, transparent)' }}
                    animate={reduceMotion ? undefined : { x: [0, -14, 0], y: [0, 16, 0] }}
                    transition={orbTransitionB}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary) 35%, transparent) 35%, color-mix(in srgb, var(--sage) 35%, transparent) 65%, transparent)'
                    }}
                />

                <div className="border-hairline bg-surface-frost/30 relative border px-5 py-7 backdrop-blur-2xl sm:px-8 sm:py-9">
                    <div className="flex items-start justify-between gap-4">
                        <div className="relative">
                            <span className="bg-primary/14 text-primary shadow-[0_12px_32px_color-mix(in_srgb,var(--primary)_18%,transparent)] relative z-10 flex size-16 items-center justify-center rounded-[22px] ring-1 ring-[color-mix(in_srgb,var(--primary)_22%,transparent)]">
                                <Archive size={28} strokeWidth={1.55} />
                            </span>
                            <span className="bg-sage/20 text-sage absolute -right-3 -bottom-2 flex size-9 items-center justify-center rounded-2xl ring-1 ring-[color-mix(in_srgb,var(--sage)_30%,transparent)] backdrop-blur-md">
                                <MapPin size={15} strokeWidth={1.75} />
                            </span>
                            <span className="bg-primary/18 text-primary absolute -top-2 -left-2 flex size-7 items-center justify-center rounded-xl ring-1 ring-[color-mix(in_srgb,var(--primary)_25%,transparent)] backdrop-blur-md">
                                <Users size={12} strokeWidth={1.85} />
                            </span>
                        </div>

                        <div className="hidden items-center gap-2 sm:flex">
                            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide">
                                {t('people')}
                            </span>
                            <span className="bg-sage/15 text-sage rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide">
                                {t('places')}
                            </span>
                        </div>
                    </div>

                    <h1 className="mt-7 text-[2rem] leading-[1.1] font-semibold tracking-tight sm:text-4xl md:text-[2.75rem]">
                        {tHome('tab.archive')}
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-lg text-[15px] leading-relaxed sm:text-base">
                        {tHome('sectionArchiveBody')}
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4, delay: 0.05 }}
                className="flex w-full flex-col gap-4"
            >
                <Surface frost capsule className="flex flex-col gap-3 p-3 sm:p-4">
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
                        leftSection={<Search size={16} className="text-muted-foreground" />}
                    />
                </Surface>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 8 }}
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
            </motion.div>
        </div>
    )
}
