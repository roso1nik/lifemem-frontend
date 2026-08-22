'use client'

import { useCallback, useMemo, useState, type MouseEvent } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'

export type GraphNodeId = 'park' | 'dasha' | 'kyoto' | 'evening' | 'coffee'

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
}

const FULL_NODES: GraphNode[] = [
    { id: 'park', x: 148, y: 188, r: 34, tone: 'aqua' },
    { id: 'dasha', x: 312, y: 86, r: 24, tone: 'sage' },
    { id: 'kyoto', x: 508, y: 118, r: 28, tone: 'aqua' },
    { id: 'evening', x: 576, y: 278, r: 32, tone: 'sage' },
    { id: 'coffee', x: 338, y: 304, r: 18, tone: 'aqua' }
]

const COMPACT_NODES: GraphNode[] = [
    { id: 'park', x: 90, y: 78, r: 22, tone: 'aqua' },
    { id: 'dasha', x: 188, y: 32, r: 14, tone: 'sage' },
    { id: 'kyoto', x: 268, y: 70, r: 16, tone: 'aqua' },
    { id: 'evening', x: 214, y: 118, r: 18, tone: 'sage' }
]

const FULL_EDGES: [GraphNodeId, GraphNodeId][] = [
    ['park', 'dasha'],
    ['park', 'kyoto'],
    ['dasha', 'kyoto'],
    ['evening', 'coffee'],
    ['park', 'evening'],
    ['coffee', 'dasha']
]

const COMPACT_EDGES: [GraphNodeId, GraphNodeId][] = [
    ['park', 'dasha'],
    ['park', 'kyoto'],
    ['dasha', 'kyoto'],
    ['park', 'evening']
]

export const MemoryGraph = ({ compact = false, activeId = null, className }: MemoryGraphProps) => {
    const t = useTranslations('landing')
    const [hover, setHover] = useState<GraphNodeId | null>(null)
    const onEnter = useCallback((event: MouseEvent<SVGGElement>) => {
        const id = event.currentTarget.dataset.id as GraphNodeId | undefined
        if (id) setHover(id)
    }, [])
    const onLeave = useCallback(() => setHover(null), [])
    const nodes = compact ? COMPACT_NODES : FULL_NODES
    const edges = compact ? COMPACT_EDGES : FULL_EDGES
    const byId = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes])
    const focus = hover ?? activeId
    const vb = compact ? '0 0 320 150' : '0 0 720 400'

    return (
        <svg
            viewBox={vb}
            className={cn('h-auto w-full overflow-visible', className)}
            role="img"
            aria-label={t('graph.caption')}
        >
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
                            'stroke-primary/30 transition-opacity duration-200',
                            focus && !lit && 'opacity-25',
                            lit && 'stroke-primary/70'
                        )}
                        strokeWidth={lit ? 1.8 : 1.2}
                    />
                )
            })}
            {nodes.map((node) => {
                const lit = focus === node.id
                const fill = node.tone === 'aqua' ? 'fill-accent' : 'fill-muted'
                const stroke = node.tone === 'aqua' ? 'stroke-primary' : 'stroke-sage'
                return (
                    <g
                        key={node.id}
                        data-id={node.id}
                        onMouseEnter={onEnter}
                        onMouseLeave={onLeave}
                        className="cursor-default"
                    >
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            className={cn(
                                fill,
                                stroke,
                                'transition-transform duration-200',
                                focus && !lit && 'opacity-40'
                            )}
                            strokeWidth={lit ? 2 : 1.4}
                        />
                        {!compact && (
                            <text
                                x={node.x}
                                y={node.y + node.r + 18}
                                textAnchor="middle"
                                fill="currentColor"
                                fontSize={11}
                                fontWeight={500}
                                className="text-foreground"
                            >
                                {t(`nodes.${node.id}`)}
                            </text>
                        )}
                    </g>
                )
            })}
        </svg>
    )
}

export const graphNodeForNote = (noteId: string): GraphNodeId | null => {
    if (noteId === 'park' || noteId === 'evening' || noteId === 'kyoto') return noteId
    return null
}
