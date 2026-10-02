'use client'

import { useCallback, useId, useMemo, useState, type MouseEvent } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'
import { GRAPH_NODE_IMAGES } from './graph-node-images'

export type GraphNodeId = 'park' | 'dasha' | 'cafe' | 'evening' | 'max'

type GraphNode = {
    id: GraphNodeId
    x: number
    y: number
    r: number
    tone: 'aqua' | 'sage'
}

type MemoryGraphProps = {
    compact?: boolean
    activeId?: GraphNodeId | null
    className?: string
    interactive?: boolean
    /** Show node name labels under circles (landing graph section only) */
    nodeLabels?: boolean
}

const FULL_NODES: GraphNode[] = [
    { id: 'park', x: 148, y: 188, r: 34, tone: 'aqua' },
    { id: 'dasha', x: 312, y: 86, r: 24, tone: 'sage' },
    { id: 'cafe', x: 508, y: 118, r: 28, tone: 'aqua' },
    { id: 'evening', x: 576, y: 278, r: 32, tone: 'sage' },
    { id: 'max', x: 338, y: 304, r: 20, tone: 'aqua' }
]

const COMPACT_NODES: GraphNode[] = [
    { id: 'park', x: 86, y: 68, r: 19, tone: 'aqua' },
    { id: 'dasha', x: 172, y: 26, r: 12, tone: 'sage' },
    { id: 'cafe', x: 252, y: 56, r: 13, tone: 'aqua' },
    { id: 'evening', x: 196, y: 98, r: 15, tone: 'sage' }
]

const FULL_EDGES: [GraphNodeId, GraphNodeId][] = [
    ['park', 'dasha'],
    ['park', 'cafe'],
    ['dasha', 'cafe'],
    ['evening', 'max'],
    ['park', 'evening'],
    ['max', 'cafe'],
    ['max', 'dasha']
]

const COMPACT_EDGES: [GraphNodeId, GraphNodeId][] = [
    ['park', 'dasha'],
    ['park', 'cafe'],
    ['dasha', 'cafe'],
    ['park', 'evening']
]

export const MemoryGraph = ({
    compact = false,
    activeId = null,
    className,
    interactive = false,
    nodeLabels = false
}: MemoryGraphProps) => {
    const t = useTranslations('landing')
    const uid = useId().replace(/:/g, '')
    const [hover, setHover] = useState<GraphNodeId | null>(null)
    const [picked, setPicked] = useState<GraphNodeId | null>(null)
    const onEnter = useCallback((event: MouseEvent<SVGGElement>) => {
        const id = event.currentTarget.dataset.id as GraphNodeId | undefined
        if (id) setHover(id)
    }, [])
    const onLeave = useCallback(() => setHover(null), [])
    const onPick = useCallback(
        (event: MouseEvent<SVGGElement>) => {
            if (!interactive) return
            const id = event.currentTarget.dataset.id as GraphNodeId | undefined
            if (id) setPicked((prev) => (prev === id ? null : id))
        },
        [interactive]
    )
    const nodes = compact ? COMPACT_NODES : FULL_NODES
    const edges = compact ? COMPACT_EDGES : FULL_EDGES
    const byId = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes])
    const focus = interactive ? hover ?? picked ?? activeId : activeId
    const vb = compact ? '0 0 320 152' : '0 0 720 400'
    const labelOffset = compact ? 14 : 18
    const labelSize = compact ? 9.5 : 11
    const showThumb = (r: number) => r >= 11

    return (
        <div className={cn('w-full', className)}>
            <svg
                viewBox={vb}
                className="h-auto w-full overflow-visible"
                role="img"
                aria-label={t('graph.caption')}
            >
                <defs>
                    {nodes.map((node) => {
                        const clipId = `${uid}-clip-${node.id}`
                        const r = litRadius(node, focus)
                        return (
                            <clipPath key={clipId} id={clipId}>
                                <circle cx={node.x} cy={node.y} r={Math.max(r - 1.5, 4)} />
                            </clipPath>
                        )
                    })}
                </defs>
                {edges.map(([from, to]) => {
                    const a = byId[from]
                    const b = byId[to]
                    if (!a || !b) return null
                    const lit = focus === from || focus === to
                    return (
                        <line
                            key={`${from}-${to}`}
                            x1={a.x}
                            y1={a.y}
                            x2={b.x}
                            y2={b.y}
                            className={cn(
                                'stroke-primary/30 transition-all duration-200',
                                focus && !lit && 'opacity-25',
                                lit && 'stroke-primary/75'
                            )}
                            strokeWidth={lit ? 1.8 : 1.2}
                        />
                    )
                })}
                {nodes.map((node) => {
                    const lit = focus === node.id
                    const r = litRadius(node, focus)
                    const stroke = node.tone === 'aqua' ? 'stroke-primary' : 'stroke-sage'
                    const clipId = `${uid}-clip-${node.id}`
                    const thumb = showThumb(node.r)

                    return (
                        <g
                            key={node.id}
                            data-id={node.id}
                            onMouseEnter={interactive ? onEnter : undefined}
                            onMouseLeave={interactive ? onLeave : undefined}
                            onClick={interactive ? onPick : undefined}
                            className={cn(interactive && 'cursor-pointer')}
                        >
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={r}
                                className={cn(
                                    'fill-card transition-all duration-200',
                                    stroke,
                                    focus && !lit && 'opacity-40',
                                    lit && 'opacity-100'
                                )}
                                strokeWidth={lit ? 2.2 : 1.4}
                            />
                            {thumb && (
                                <image
                                    href={GRAPH_NODE_IMAGES[node.id]}
                                    x={node.x - r + 1.5}
                                    y={node.y - r + 1.5}
                                    width={(r - 1.5) * 2}
                                    height={(r - 1.5) * 2}
                                    clipPath={`url(#${clipId})`}
                                    preserveAspectRatio="xMidYMid slice"
                                    className={cn('pointer-events-none transition-opacity duration-200', focus && !lit && 'opacity-40')}
                                />
                            )}
                            {nodeLabels && (
                                <text
                                    x={node.x}
                                    y={node.y + r + labelOffset}
                                    textAnchor="middle"
                                    fill="currentColor"
                                    fontSize={labelSize}
                                    fontWeight={500}
                                    className={cn('text-foreground pointer-events-none', focus && !lit && 'opacity-50')}
                                >
                                    {t(`nodes.${node.id}`)}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

const litRadius = (node: GraphNode, focus: GraphNodeId | null) => {
    const lit = focus === node.id
    return lit ? node.r * 1.06 : node.r
}

export const graphNodeForNote = (noteId: string): GraphNodeId | null => {
    if (noteId === 'park' || noteId === 'evening' || noteId === 'cafe') return noteId
    return null
}
