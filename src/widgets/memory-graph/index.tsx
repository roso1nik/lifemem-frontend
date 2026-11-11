'use client'

import { useEffect, useMemo, useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { GitBranch, Link2, Search, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { EdgeMouseHandler, NodeMouseHandler } from '@xyflow/react'
import {
    useCreateGraphLink,
    useGraph,
    type GraphNodeType
} from '@/entities/graph/api'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import { Button, IconButton, Loader, Surface, TextInput } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { GraphCanvas } from './graph-canvas'
import { edgeKey, type MemoryEdge, type MemoryNode } from './map-graph'

const ALL_TYPES: GraphNodeType[] = ['entry', 'person', 'place']

export const MemoryGraphPage = () => {
    const t = useTranslations('home.graphPage')
    const tHome = useTranslations('home')
    const reduceMotion = Boolean(useReducedMotion())
    const { goNote } = useWorkspaceNavigation()

    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(search.trim(), 250)
    const [types, setTypes] = useState<GraphNodeType[]>([...ALL_TYPES])
    const [orphans, setOrphans] = useState(true)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [selectedEdgeKey, setSelectedEdgeKey] = useState<string | null>(null)

    const graphQuery = useGraph({
        query: debouncedSearch || undefined,
        types: types.length === ALL_TYPES.length ? undefined : types,
        orphans
    })
    const { mutate: createLink, isPending: linking } = useCreateGraphLink()

    const nodes = graphQuery.data?.nodes ?? []
    const edges = graphQuery.data?.edges ?? []

    const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])

    const selectedEdge = useMemo(
        () => edges.find((edge) => edgeKey(edge) === selectedEdgeKey) ?? null,
        [edges, selectedEdgeKey]
    )

    const selectedEntries = useMemo(
        () =>
            selectedIds
                .map((id) => nodeById.get(id))
                .filter((node): node is NonNullable<typeof node> => Boolean(node && node.type === 'entry')),
        [selectedIds, nodeById]
    )

    useEffect(() => {
        setSelectedIds((prev) => {
            const next = prev.filter((id) => nodeById.has(id))
            return next.length === prev.length ? prev : next
        })
    }, [nodeById])

    useEffect(() => {
        if (!selectedEdgeKey) return
        if (!edges.some((edge) => edgeKey(edge) === selectedEdgeKey)) {
            setSelectedEdgeKey(null)
        }
    }, [edges, selectedEdgeKey])

    const toggleType = (type: GraphNodeType) => {
        setTypes((prev) => {
            if (prev.includes(type)) {
                const next = prev.filter((item) => item !== type)
                return next.length ? next : prev
            }
            return [...prev, type]
        })
    }

    const onNodeClick: NodeMouseHandler<MemoryNode> = (_event, node) => {
        setSelectedEdgeKey(null)
        if (node.data.graphType !== 'entry') {
            setSelectedIds([])
            return
        }
        setSelectedIds((prev) => {
            if (prev.includes(node.id)) return prev.filter((id) => id !== node.id)
            if (prev.length >= 2) return [prev[1], node.id]
            return [...prev, node.id]
        })
    }

    const onNodeDoubleClick: NodeMouseHandler<MemoryNode> = (_event, node) => {
        if (node.data.graphType !== 'entry') return
        goNote({ id: node.id, title: node.data.name.slice(0, 28) || tHome('tab.notes') })
    }

    const onEdgeClick: EdgeMouseHandler<MemoryEdge> = (_event, edge) => {
        setSelectedEdgeKey(edge.id)
        setSelectedIds([])
    }

    const canLink = selectedEntries.length === 2

    return (
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-6 md:w-4/5 md:px-6 md:py-8">
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                className="relative mb-6 overflow-hidden rounded-[24px]"
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 80% 90% at 12% 10%, color-mix(in srgb, var(--primary) 22%, transparent), transparent 58%),
                            radial-gradient(ellipse 70% 80% at 88% 20%, color-mix(in srgb, var(--sage) 16%, transparent), transparent 52%),
                            linear-gradient(180deg, color-mix(in srgb, var(--card) 55%, transparent), color-mix(in srgb, var(--background) 40%, transparent))
                        `
                    }}
                />
                <div className="border-hairline bg-surface-frost/40 relative border px-5 py-6 backdrop-blur-xl sm:px-7 sm:py-7">
                    <span className="bg-primary/12 text-primary flex size-12 items-center justify-center rounded-[18px]">
                        <GitBranch size={22} strokeWidth={1.6} />
                    </span>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{t('title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-xl text-[15px] leading-relaxed">
                        {t('subtitle')}
                    </p>
                    <p className="text-muted-foreground mt-3 text-xs">
                        {t('nodesCount', { count: nodes.length })} ·{' '}
                        {t('edgesCount', { count: edges.length })}
                    </p>
                </div>
            </motion.div>

            <Surface frost capsule className="mb-4 flex flex-col gap-3 p-3 sm:p-4">
                <TextInput
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    placeholder={t('searchPlaceholder')}
                    leftSection={<Search size={16} />}
                />
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs font-medium">{t('types')}</span>
                    {ALL_TYPES.map((type) => {
                        const active = types.includes(type)
                        const label =
                            type === 'entry'
                                ? t('typeEntry')
                                : type === 'person'
                                  ? t('typePerson')
                                  : t('typePlace')
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => toggleType(type)}
                                className={cn(
                                    'rounded-full px-3 py-1.5 text-xs font-medium transition-transform active:scale-[0.97]',
                                    active
                                        ? type === 'entry'
                                            ? 'bg-primary/15 text-primary'
                                            : 'bg-sage/15 text-sage'
                                        : 'bg-muted text-muted-foreground'
                                )}
                            >
                                {label}
                            </button>
                        )
                    })}
                    <div className="ml-auto">
                        <Switch
                            checked={orphans}
                            onChange={(e) => setOrphans(e.currentTarget.checked)}
                            label={t('orphans')}
                        />
                    </div>
                </div>
            </Surface>

            <Surface frost capsule className="border-hairline relative overflow-hidden p-0">
                {graphQuery.isLoading && (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <Loader variant="section" size="sm" />
                    </div>
                )}
                {graphQuery.isError && <p className="p-6 text-sm text-red-600">{t('error')}</p>}
                {graphQuery.isSuccess && nodes.length === 0 && (
                    <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 px-6 text-center">
                        <p className="text-sm font-semibold">{t('empty')}</p>
                        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
                            {t('emptyHint')}
                        </p>
                    </div>
                )}
                {nodes.length > 0 && (
                    <GraphCanvas
                        apiNodes={nodes}
                        apiEdges={edges}
                        selectedIds={selectedIds}
                        selectedEdgeKey={selectedEdgeKey}
                        reducedMotion={reduceMotion}
                        onNodeClick={onNodeClick}
                        onNodeDoubleClick={onNodeDoubleClick}
                        onEdgeClick={onEdgeClick}
                        onPaneClick={() => {
                            setSelectedEdgeKey(null)
                        }}
                    />
                )}
            </Surface>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
                <Surface frost capsule className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                        <Link2 size={15} className="text-primary" />
                        <p className="text-sm font-medium">{t('linkHint')}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedEntries.map((node) => (
                            <span
                                key={node.id}
                                className="bg-primary/12 text-primary rounded-full px-2.5 py-1 text-xs font-medium"
                            >
                                {node.name}
                            </span>
                        ))}
                        {selectedIds.length > 0 && (
                            <IconButton
                                aria-label={t('clearSelection')}
                                onClick={() => setSelectedIds([])}
                                className="rounded-full"
                            >
                                <X size={14} />
                            </IconButton>
                        )}
                    </div>
                    <Button
                        type="button"
                        disabled={!canLink}
                        loading={linking}
                        className="self-start rounded-full"
                        onClick={() => {
                            if (!canLink) return
                            createLink(
                                {
                                    entryAId: selectedEntries[0].id,
                                    entryBId: selectedEntries[1].id
                                },
                                { onSuccess: () => setSelectedIds([]) }
                            )
                        }}
                    >
                        {t('linkAction')}
                    </Button>
                </Surface>

                {selectedEdge && (
                    <Surface frost capsule className="flex min-w-[220px] flex-1 flex-col gap-1.5 p-4">
                        <p className="text-sm font-semibold">{t('selectedEdge')}</p>
                        <p className="text-muted-foreground text-xs">{selectedEdge.type}</p>
                        {(selectedEdge.reason?.manual ||
                            selectedEdge.type === 'entry_entry_manual') && (
                            <p className="text-primary text-xs font-medium">{t('manual')}</p>
                        )}
                        {selectedEdge.reason?.score != null && (
                            <p className="text-xs">
                                {t('score', { value: selectedEdge.reason.score.toFixed(2) })}
                            </p>
                        )}
                        {Boolean(selectedEdge.reason?.sharedPeopleIds?.length) && (
                            <p className="text-xs">
                                {t('sharedPeople', {
                                    count: selectedEdge.reason!.sharedPeopleIds!.length
                                })}
                            </p>
                        )}
                        {Boolean(selectedEdge.reason?.sharedPlaceIds?.length) && (
                            <p className="text-xs">
                                {t('sharedPlaces', {
                                    count: selectedEdge.reason!.sharedPlaceIds!.length
                                })}
                            </p>
                        )}
                    </Surface>
                )}
            </div>
        </div>
    )
}
