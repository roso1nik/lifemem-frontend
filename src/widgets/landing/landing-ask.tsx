'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, MessageCircle, Search, Sparkles } from 'lucide-react'
import { getEntryPreviewText } from '@/entities/entry/model'
import { EntryCard } from '@/entities/entry/ui/entry-card'
import { Surface } from '@/shared/ui'
import { cn, dayjsInstance } from '@/shared/utils'
import { getLandingNotes, LANDING_PHOTOS } from './mock'
import { Reveal } from './reveal'
import { landingCardClass, landingSectionClass, landingSectionInnerClass } from './landing-layout'

const QUERY_CHAR_MS = 18
const PROMPT_CHAR_MS = 16
const PAUSE_SHORT_MS = 70
const PAUSE_MED_MS = 120
const RESULT_STAGGER_MS = 95

const pop = { type: 'spring' as const, stiffness: 420, damping: 28, mass: 0.75 }

export const LandingAsk = () => {
    const t = useTranslations('landing')
    const reduce = useReducedMotion()
    const demoRef = useRef<HTMLDivElement>(null)
    const inView = useInView(demoRef, { once: false, amount: 0.32, margin: '0px 0px -6% 0px' })

    const notes = useMemo(
        () =>
            getLandingNotes({
                park: t('notes.park'),
                evening: t('notes.evening'),
                cafe: t('notes.cafe')
            }),
        [t]
    )
    const results = notes.filter((note) => note.id === 'park' || note.id === 'cafe')
    const source = notes.find((note) => note.id === 'park')
    const fullQuery = t('ask.query')
    const fullPrompt = t('ask.prompt')

    const [typedQuery, setTypedQuery] = useState('')
    const [visibleResults, setVisibleResults] = useState(0)
    const [rightActive, setRightActive] = useState(false)
    const [typedPrompt, setTypedPrompt] = useState('')
    const [showAnswer, setShowAnswer] = useState(false)
    const [showSource, setShowSource] = useState(false)
    const [queryTyping, setQueryTyping] = useState(false)
    const [promptTyping, setPromptTyping] = useState(false)
    const [sequenceDone, setSequenceDone] = useState(false)

    useEffect(() => {
        if (!inView) {
            if (reduce) return
            setTypedQuery('')
            setVisibleResults(0)
            setRightActive(false)
            setTypedPrompt('')
            setShowAnswer(false)
            setShowSource(false)
            setQueryTyping(false)
            setPromptTyping(false)
            setSequenceDone(false)
            return
        }

        if (reduce) {
            setTypedQuery(fullQuery)
            setVisibleResults(results.length)
            setRightActive(true)
            setTypedPrompt(fullPrompt)
            setShowAnswer(true)
            setShowSource(true)
            setSequenceDone(true)
            return
        }

        let cancelled = false
        const timers: number[] = []
        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                timers.push(window.setTimeout(() => resolve(), ms))
            })
        const typeText = async (text: string, ms: number, apply: (value: string) => void) => {
            apply('')
            for (let i = 1; i <= text.length; i += 1) {
                if (cancelled) return
                apply(text.slice(0, i))
                await wait(ms)
            }
        }

        const run = async () => {
            setVisibleResults(0)
            setRightActive(false)
            setTypedPrompt('')
            setShowAnswer(false)
            setShowSource(false)
            setSequenceDone(false)
            setQueryTyping(true)
            await typeText(fullQuery, QUERY_CHAR_MS, setTypedQuery)
            if (cancelled) return
            setQueryTyping(false)
            await wait(PAUSE_SHORT_MS)

            for (let i = 1; i <= results.length; i += 1) {
                if (cancelled) return
                setVisibleResults(i)
                await wait(RESULT_STAGGER_MS)
            }

            await wait(PAUSE_MED_MS)
            setRightActive(true)
            setPromptTyping(true)
            await typeText(fullPrompt, PROMPT_CHAR_MS, setTypedPrompt)
            if (cancelled) return
            setPromptTyping(false)
            await wait(PAUSE_SHORT_MS)
            setShowAnswer(true)
            await wait(PAUSE_MED_MS)
            setShowSource(true)
            setSequenceDone(true)
        }

        void run()

        return () => {
            cancelled = true
            timers.forEach((id) => window.clearTimeout(id))
        }
    }, [inView, reduce, fullQuery, fullPrompt, results.length])

    const resultsShown = reduce || sequenceDone ? results.length : visibleResults

    return (
        <section id="ask" className={landingSectionClass}>
            <div className={landingSectionInnerClass}>
                <Reveal className="mx-auto max-w-2xl text-center">
                    <p className="text-primary text-sm font-medium tracking-tight">{t('ask.kicker')}</p>
                    <h2 className="mt-2 text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl">
                        {t('ask.title')}
                    </h2>
                    <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t('ask.body')}</p>
                </Reveal>

                <div
                    ref={demoRef}
                    className="mt-10 grid grid-cols-1 items-stretch gap-4 lg:mt-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-5"
                >
                    <Surface frost className="flex h-full flex-col overflow-hidden">
                        <div className="border-hairline flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
                            <span className="bg-accent text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight">
                                <Search size={12} strokeWidth={2} />
                                {t('ask.modeSearch')}
                            </span>
                            <motion.span
                                className="text-muted-foreground text-[11px] font-medium tabular-nums"
                                key={resultsShown}
                                initial={reduce ? false : { opacity: 0.4, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {t('ask.resultsCount', { count: resultsShown })}
                            </motion.span>
                        </div>

                        <div className="px-4 pt-4 sm:px-5">
                            <div className="border-hairline bg-muted/35 flex items-center gap-2.5 rounded-[var(--radius-card)] border px-3.5 py-3">
                                <Search size={16} className="text-primary shrink-0" strokeWidth={1.7} />
                                <p className="text-foreground min-w-0 flex-1 truncate text-sm font-medium tracking-tight">
                                    {typedQuery}
                                    {queryTyping && (
                                        <span className="bg-primary ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" />
                                    )}
                                </p>
                                <span className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
                                    <Sparkles size={14} strokeWidth={1.75} />
                                </span>
                            </div>
                        </div>

                        <ul className="divide-hairline mt-3 min-h-[9.5rem] flex-1 divide-y px-1 pb-1 sm:min-h-[10.5rem]">
                            <AnimatePresence initial={false}>
                                {results.slice(0, visibleResults).map((note, index) => (
                                    <motion.li
                                        key={note.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ ...pop, delay: index * 0.02 }}
                                    >
                                        <EntryCard entry={note} />
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </Surface>

                    <motion.div
                        className="text-muted-foreground hidden flex-col items-center justify-center gap-1 lg:flex"
                        aria-hidden
                        animate={{ opacity: rightActive ? 1 : 0.35, scale: rightActive ? 1 : 0.92 }}
                        transition={{ duration: 0.25 }}
                    >
                        <span className="bg-muted/60 flex size-9 items-center justify-center rounded-full">
                            <ArrowRight size={18} strokeWidth={1.75} />
                        </span>
                        <span className="text-[10px] font-medium tracking-wide uppercase">{t('ask.flowLabel')}</span>
                    </motion.div>

                    <motion.div
                        initial={false}
                        animate={{ opacity: rightActive ? 1 : 0.42 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Surface frost className="flex h-full flex-col overflow-hidden">
                            <div className="border-hairline flex items-center gap-2 border-b px-4 py-3 sm:px-5">
                                <span className="bg-muted text-sage inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight">
                                    <MessageCircle size={12} strokeWidth={2} />
                                    {t('ask.modeRag')}
                                </span>
                            </div>

                            <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
                                <div className="border-hairline bg-muted/30 min-h-[4.75rem] rounded-[var(--radius-card)] border px-4 py-3">
                                    <p className="text-muted-foreground text-[11px] font-medium tracking-tight uppercase">
                                        {t('ask.questionLabel')}
                                    </p>
                                    <p className="text-foreground mt-1.5 text-sm leading-snug font-medium">
                                        {typedPrompt}
                                        {promptTyping && (
                                            <span className="bg-primary ml-0.5 inline-block h-3.5 w-0.5 animate-pulse align-middle" />
                                        )}
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {showAnswer && (
                                        <motion.div
                                            className="border-primary/25 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_8%,var(--card)),var(--card))] mt-4 rounded-[var(--radius-card)] border border-l-[3px] px-4 py-4 sm:px-5"
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={pop}
                                        >
                                            <p className="text-primary text-[11px] font-semibold tracking-tight">
                                                {t('ask.answerLabel')}
                                            </p>
                                            <p className="text-foreground mt-2 text-[15px] leading-relaxed font-medium tracking-tight sm:text-base">
                                                {t('ask.answer')}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {showSource && source && (
                                        <motion.div
                                            className={cn(landingCardClass, 'mt-4 flex gap-3 p-3')}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ ...pop, delay: 0.04 }}
                                        >
                                            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg sm:size-[4.5rem]">
                                                <Image
                                                    src={LANDING_PHOTOS.park}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="72px"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sage text-[11px] font-semibold tracking-tight">
                                                    {t('ask.fromNotes')}
                                                </p>
                                                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-snug">
                                                    {getEntryPreviewText(source)}
                                                </p>
                                                <p className="text-muted-foreground mt-1.5 text-[11px] tabular-nums">
                                                    {dayjsInstance(source.createdAt).format('D MMMM, HH:mm')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Surface>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
