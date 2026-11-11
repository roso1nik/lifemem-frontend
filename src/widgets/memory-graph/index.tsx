'use client'

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type MouseEvent as ReactMouseEvent
} from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { Switch } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { ArrowLeft, GitBranch, Link2, Search, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { EdgeMouseHandler, NodeMouseHandler } from '@xyflow/react'
import type { ForceGraphMethods } from 'react-force-graph-2d'
import {
    useCreateGraphLink,
    useGraph,
    type GraphNodeType
} from '@/entities/graph/api'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import { Button, IconButton, Loader, SegmentedControl, Surface, TextInput } from '@/shared/ui'
import { cn } from '@/shared/utils'
import { ForceGraphCanvas } from './force-graph-canvas'
import { GraphCanvas } from './graph-canvas'
import { GraphControls } from './graph-controls'
import { GraphHint } from './graph-hint'
import { GraphHoverTooltip } from './graph-hover-tooltip'
import { GraphSettingsPanel } from './graph-settings-panel'
import {
    buildLocalSubgraph,
    edgeKey,
    toGraphData,
    type ForceGraphLink,
    type ForceGraphNode,
    type MemoryEdge,
    type MemoryNode
} from './map-graph'
import { useGraphSettings, type GraphRendererMode } from './model/graph-settings'

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
    const [focusId, setFocusId] = useState<string | null>(null)
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [hoverNode, setHoverNode] = useState<ForceGraphNode | null>(null)
    const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)

    const localDepth = useGraphSettings((s) => s.display.localDepth)
    const rendererMode = useGraphSettings((s) => s.rendererMode)
    const setRendererMode = useGraphSettings((s) => s.setRendererMode)
    const graphApiRef = useRef<ForceGraphMethods<ForceGraphNode, ForceGraphLink> | undefined>(undefined)
    const isPhysics = rendererMode === 'physics'

    useEffect(() => {
        setHoverNode(null)
        setHoverPos(null)
        setSettingsOpen(false)
    }, [rendererMode])

    const graphQuery = useGraph({
        query: debouncedSearch || undefined,
        types: types.length === ALL_TYPES.length ? undefined : types,
        orphans
    })
    const { mutate: createLink, isPending: linking } = useCreateGraphLink()

    const nodes = useMemo(() => graphQuery.data?.nodes ?? [], [graphQuery.data?.nodes])
    const edges = useMemo(() => graphQuery.data?.edges ?? [], [graphQuery.data?.edges])

    const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])

    const focusNode = focusId ? (nodeById.get(focusId) ?? null) : null

    const viewNodesEdges = useMemo(() => {
        if (!focusId) return { nodes, edges }
        return buildLocalSubgraph(nodes, edges, focusId, localDepth)
    }, [nodes, edges, focusId, localDepth])

    const graphData = useMemo(
        () => toGraphData(viewNodesEdges.nodes, viewNodesEdges.edges),
        [viewNodesEdges]
    )

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

    useEffect(() => {
        if (focusId && !nodeById.has(focusId)) setFocusId(null)
    }, [focusId, nodeById])

    useEffect(() => {
        if (!focusId) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setFocusId(null)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [focusId])

    const toggleType = (type: GraphNodeType) => {
        setTypes((prev) => {
            if (prev.includes(type)) {
                const next = prev.filter((item) => item !== type)
                return next.length ? next : prev
            }
            return [...prev, type]
        })
    }

    const onNodeClick = useCallback((node: ForceGraphNode, event?: MouseEvent | ReactMouseEvent) => {
        setSelectedEdgeKey(null)
        const multi = Boolean(event && (event.metaKey || event.ctrlKey))
        if (multi && node.type === 'entry') {
            setSelectedIds((prev) => {
                if (prev.includes(node.id)) return prev.filter((id) => id !== node.id)
                if (prev.length >= 2) return [prev[1], node.id]
                return [...prev, node.id]
            })
            return
        }
        setFocusId(node.id)
    }, [])

    const onNodeDoubleClick = useCallback(
        (node: ForceGraphNode) => {
            if (node.type !== 'entry') return
            goNote({ id: node.id, title: node.name.slice(0, 28) || tHome('tab.notes') })
        },
        [goNote, tHome]
    )

    const onEdgeClick = useCallback((link: ForceGraphLink) => {
        setSelectedEdgeKey(link.id)
        setSelectedIds([])
    }, [])

    const onFlowNodeClick: NodeMouseHandler<MemoryNode> = useCallback(
        (event, node) => {
            onNodeClick(
                {
                    id: node.id,
                    name: node.data.name,
                    type: node.data.graphType,
                    degree: node.data.degree
                },
                event
            )
        },
        [onNodeClick]
    )

    const onFlowNodeDoubleClick: NodeMouseHandler<MemoryNode> = useCallback(
        (_event, node) => {
            onNodeDoubleClick({
                id: node.id,
                name: node.data.name,
                type: node.data.graphType,
                degree: node.data.degree
            })
        },
        [onNodeDoubleClick]
    )

    const onFlowEdgeClick: EdgeMouseHandler<MemoryEdge> = useCallback(
        (_event, edge) => {
            onEdgeClick({
                id: edge.id,
                source: String(edge.source),
                target: String(edge.target),
                type: edge.data?.edgeType ?? 'entry_entry',
                weight: edge.data?.weight ?? 1,
                reason: edge.data?.reason,
                manual: Boolean(edge.data?.manual)
            })
        },
        [onEdgeClick]
    )

    const modeOptions = useMemo(
        () =>
            [
                { value: 'physics' as const, label: t('modePhysics') },
                { value: 'flow' as const, label: t('modeFlow') }
            ] satisfies { value: GraphRendererMode; label: string }[],
        [t]
    )

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
                        {t('nodesCount', { count: viewNodesEdges.nodes.length })} ·{' '}
                        {t('edgesCount', { count: viewNodesEdges.edges.length })}
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
                    <div className="ml-auto flex flex-wrap items-center gap-3">
                        <SegmentedControl
                            value={rendererMode}
                            options={modeOptions}
                            onChange={setRendererMode}
                            className="w-auto min-w-[200px]"
                        />
                        <Switch
                            checked={orphans}
                            onChange={(e) => setOrphans(e.currentTarget.checked)}
                            label={t('orphans')}
                        />
                    </div>
                </div>
            </Surface>

            {focusNode && (
                <Surface frost capsule className="mb-3 flex items-center gap-2 px-3 py-2">
                    <IconButton
                        size="sm"
                        aria-label={t('backToFull')}
                        className="rounded-full"
                        onClick={() => setFocusId(null)}
                    >
                        <ArrowLeft size={14} />
                    </IconButton>
                    <p className="text-sm">
                        <span className="text-muted-foreground">{t('fullGraph')}</span>
                        <span className="text-muted-foreground mx-1.5">/</span>
                        <span className="font-medium">{focusNode.name}</span>
                    </p>
                    <span className="bg-sage/15 text-sage ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium">
                        {t('localGraph')}
                    </span>
                </Surface>
            )}

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
                {viewNodesEdges.nodes.length > 0 && (
                    <div className="relative h-[min(70vh,640px)] w-full">
                        {isPhysics ? (
                            <>
                                <ForceGraphCanvas
                                    data={graphData}
                                    selectedIds={selectedIds}
                                    selectedEdgeKey={selectedEdgeKey}
                                    reducedMotion={reduceMotion}
                                    graphRef={graphApiRef}
                                    onNodeClick={onNodeClick}
                                    onNodeDoubleClick={onNodeDoubleClick}
                                    onEdgeClick={onEdgeClick}
                                    onPaneClick={() => setSelectedEdgeKey(null)}
                                    onHoverNodeChange={(node, screen) => {
                                        setHoverNode(node)
                                        setHoverPos(screen)
                                    }}
                                />
                                <GraphHoverTooltip node={hoverNode} position={hoverPos} />
                                <GraphControls graphRef={graphApiRef} reducedMotion={reduceMotion} />
                            </>
                        ) : (
                            <GraphCanvas
                                apiNodes={viewNodesEdges.nodes}
                                apiEdges={viewNodesEdges.edges}
                                selectedIds={selectedIds}
                                selectedEdgeKey={selectedEdgeKey}
                                reducedMotion={reduceMotion}
                                onNodeClick={onFlowNodeClick}
                                onNodeDoubleClick={onFlowNodeDoubleClick}
                                onEdgeClick={onFlowEdgeClick}
                                onPaneClick={() => setSelectedEdgeKey(null)}
                            />
                        )}
                        <GraphHint />
                        <GraphSettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
                    </div>
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
                                    count: selectedEdge.reason?.sharedPeopleIds?.length ?? 0
                                })}
                            </p>
                        )}
                        {Boolean(selectedEdge.reason?.sharedPlaceIds?.length) && (
                            <p className="text-xs">
                                {t('sharedPlaces', {
                                    count: selectedEdge.reason?.sharedPlaceIds?.length ?? 0
                                })}
                            </p>
                        )}
                    </Surface>
                )}
            </div>
        </div>
    )
}
