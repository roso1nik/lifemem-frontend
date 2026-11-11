'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { GitBranch, Link2, Search, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import {
    useCreateGraphLink,
    useGraph,
    type GraphEdge,
    type GraphNode,
    type GraphNodeType
} from '@/entities/graph/api'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import { Button, IconButton, Loader, Surface, TextInput } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { layoutForce, layoutStatic, type LaidOutNode } from './layout'

const ALL_TYPES: GraphNodeType[] = ['entry', 'person', 'place']
const VIEW_W = 960
const VIEW_H = 640

const nodeRadius = (node: GraphNode) => {
    if (node.type === 'entry') return 14 + Math.min(node.degree, 8)
    if (node.type === 'person') return 11 + Math.min(node.degree, 6)
    return 10 + Math.min(node.degree, 6)
}

const edgeKey = (edge: GraphEdge) => `${edge.source}|${edge.target}|${edge.type}`

export const MemoryGraphPage = () => {
    const t = useTranslations('home.graphPage')
    const tHome = useTranslations('home')
    const reduceMotion = useReducedMotion()
    const { goNote } = useWorkspaceNavigation()

    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(search.trim(), 250)
    const [types, setTypes] = useState<GraphNodeType[]>([...ALL_TYPES])
    const [orphans, setOrphans] = useState(true)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [selectedEdgeKey, setSelectedEdgeKey] = useState<string | null>(null)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const dragRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

    const graphQuery = useGraph({
        query: debouncedSearch || undefined,
        types: types.length === ALL_TYPES.length ? undefined : types,
        orphans
    })
    const { mutate: createLink, isPending: linking } = useCreateGraphLink()

    const nodes = graphQuery.data?.nodes ?? []
    const edges = graphQuery.data?.edges ?? []

    const laidNodes = useMemo(() => {
        if (!nodes.length) return [] as LaidOutNode[]
        return reduceMotion
            ? layoutStatic(nodes, VIEW_W, VIEW_H)
            : layoutForce(nodes, edges, VIEW_W, VIEW_H)
    }, [nodes, edges, reduceMotion])

    const nodeById = useMemo(() => new Map(laidNodes.map((node) => [node.id, node])), [laidNodes])

    const selectedEdge = useMemo(
        () => edges.find((edge) => edgeKey(edge) === selectedEdgeKey) ?? null,
        [edges, selectedEdgeKey]
    )

    const selectedEntries = useMemo(
        () =>
            selectedIds
                .map((id) => nodeById.get(id))
                .filter((node): node is LaidOutNode => Boolean(node && node.type === 'entry')),
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

    const onNodeClick = (node: GraphNode) => {
        setSelectedEdgeKey(null)
        if (node.type === 'entry') {
            setSelectedIds((prev) => {
                if (prev.includes(node.id)) return prev.filter((id) => id !== node.id)
                if (prev.length >= 2) return [prev[1], node.id]
                return [...prev, node.id]
            })
            return
        }
        setSelectedIds([])
    }

    const onNodeDoubleClick = (node: GraphNode) => {
        if (node.type !== 'entry') return
        goNote({ id: node.id, title: node.name.slice(0, 28) || tHome('tab.notes') })
    }

    const onWheel = (event: WheelEvent<SVGSVGElement>) => {
        event.preventDefault()
        const delta = event.deltaY > 0 ? 0.9 : 1.1
        setZoom((z) => Math.min(2.4, Math.max(0.45, z * delta)))
    }

    const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
        if (event.button !== 0) return
        dragRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
        if (!dragRef.current) return
        const dx = event.clientX - dragRef.current.x
        const dy = event.clientY - dragRef.current.y
        setPan({ x: dragRef.current.panX + dx, y: dragRef.current.panY + dy })
    }

    const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
        dragRef.current = null
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }
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
                        {t('nodesCount', { count: nodes.length })} · {t('edgesCount', { count: edges.length })}
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

            <div className="border-hairline bg-surface-frost/50 relative min-h-[420px] overflow-hidden rounded-[24px] border backdrop-blur-xl">
                {graphQuery.isLoading && (
                    <div className="flex min-h-[420px] items-center justify-center">
                        <Loader variant="section" size="sm" />
                    </div>
                )}
                {graphQuery.isError && (
                    <p className="text-sm text-red-600 p-6">{t('error')}</p>
                )}
                {graphQuery.isSuccess && laidNodes.length === 0 && (
                    <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 px-6 text-center">
                        <p className="text-sm font-semibold">{t('empty')}</p>
                        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
                            {t('emptyHint')}
                        </p>
                    </div>
                )}
                {laidNodes.length > 0 && (
                    <svg
                        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                        className="h-[min(70vh,640px)] w-full touch-none cursor-grab active:cursor-grabbing"
                        onWheel={onWheel}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerCancel={onPointerUp}
                    >
                        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
                            {edges.map((edge) => {
                                const a = nodeById.get(edge.source)
                                const b = nodeById.get(edge.target)
                                if (!a || !b) return null
                                const key = edgeKey(edge)
                                const active = key === selectedEdgeKey
                                const manual = edge.type === 'entry_entry_manual' || edge.reason?.manual
                                return (
                                    <line
                                        key={key}
                                        x1={a.x}
                                        y1={a.y}
                                        x2={b.x}
                                        y2={b.y}
                                        stroke={
                                            active
                                                ? 'var(--primary)'
                                                : 'color-mix(in srgb, var(--foreground) 18%, transparent)'
                                        }
                                        strokeWidth={manual ? 2.2 : active ? 2 : 1}
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedEdgeKey(key)
                                            setSelectedIds([])
                                        }}
                                    />
                                )
                            })}
                            {laidNodes.map((node) => {
                                const selected = selectedIds.includes(node.id)
                                const r = nodeRadius(node)
                                const fill =
                                    node.type === 'entry'
                                        ? 'color-mix(in srgb, var(--primary) 78%, white)'
                                        : 'color-mix(in srgb, var(--sage) 72%, white)'
                                return (
                                    <g
                                        key={node.id}
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onNodeClick(node)
                                        }}
                                        onDoubleClick={(e) => {
                                            e.stopPropagation()
                                            onNodeDoubleClick(node)
                                        }}
                                    >
                                        <circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={r + (selected ? 3 : 0)}
                                            fill={fill}
                                            stroke={
                                                selected
                                                    ? 'var(--primary)'
                                                    : 'color-mix(in srgb, var(--foreground) 12%, transparent)'
                                            }
                                            strokeWidth={selected ? 2.5 : 1}
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y + r + 14}
                                            textAnchor="middle"
                                            className="fill-foreground text-[10px]"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {node.name.length > 18
                                                ? `${node.name.slice(0, 16)}…`
                                                : node.name}
                                        </text>
                                    </g>
                                )
                            })}
                        </g>
                    </svg>
                )}
            </div>

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
                                { entryAId: selectedEntries[0].id, entryBId: selectedEntries[1].id },
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
                            <p className="text-xs font-medium text-primary">{t('manual')}</p>
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
