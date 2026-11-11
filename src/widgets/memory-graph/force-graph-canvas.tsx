'use client'

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentType,
    type MutableRefObject
} from 'react'
import dynamic from 'next/dynamic'
import { forceCollide, forceX, forceY } from 'd3-force'
import { useMantineColorScheme } from '@mantine/core'
import type {
    ForceGraphMethods,
    ForceGraphProps,
    LinkObject,
    NodeObject
} from 'react-force-graph-2d'
import type { GraphNodeType } from '@/entities/graph/api'
import { Loader } from '@/shared/ui'
import {
    linkEndpoints,
    type ForceGraphData,
    type ForceGraphLink,
    type ForceGraphNode
} from './map-graph'
import { useGraphSettings, type GraphColors, type GraphDisplay, type GraphForces } from './model/graph-settings'

type GraphNodeObj = NodeObject<ForceGraphNode>
type GraphLinkObj = LinkObject<ForceGraphNode, ForceGraphLink>
type GraphApi = ForceGraphMethods<GraphNodeObj, GraphLinkObj>

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center">
            <Loader variant="section" size="sm" />
        </div>
    )
}) as unknown as ComponentType<
    ForceGraphProps<ForceGraphNode, ForceGraphLink> & {
        ref?: MutableRefObject<GraphApi | undefined>
    }
>

type ThemePalette = {
    entry: string
    person: string
    place: string
    foreground: string
    card: string
    hairline: string
}

export type ForceGraphCanvasProps = {
    data: ForceGraphData
    selectedIds: string[]
    selectedEdgeKey: string | null
    reducedMotion: boolean
    onNodeClick: (node: ForceGraphNode, event?: MouseEvent) => void
    onNodeDoubleClick: (node: ForceGraphNode) => void
    onEdgeClick: (link: ForceGraphLink) => void
    onPaneClick: () => void
    onHoverNodeChange?: (node: ForceGraphNode | null, screen: { x: number; y: number } | null) => void
    graphRef?: MutableRefObject<GraphApi | undefined>
}

const DOUBLE_CLICK_MS = 300

const readThemePalette = (): ThemePalette => {
    if (typeof window === 'undefined') {
        return {
            entry: '#5B9FB0',
            person: '#7FA892',
            place: '#7FA892',
            foreground: '#1a1a1a',
            card: '#ffffff',
            hairline: 'rgba(0,0,0,0.12)'
        }
    }
    const style = getComputedStyle(document.documentElement)
    const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
    return {
        entry: read('--primary', '#5B9FB0'),
        person: read('--sage', '#7FA892'),
        place: read('--sage', '#7FA892'),
        foreground: read('--foreground', '#1a1a1a'),
        card: read('--card', '#ffffff'),
        hairline: read('--hairline', 'rgba(0,0,0,0.12)')
    }
}

const resolveNodeColor = (type: GraphNodeType, colors: GraphColors, theme: ThemePalette) =>
    colors[type] ?? theme[type]

const nodeRadius = (node: Pick<ForceGraphNode, 'degree'>, nodeSize: number) =>
    nodeSize * Math.sqrt((node.degree ?? 0) + 1)

type DriftNode = {
    fx?: number
    fy?: number
    vx?: number
    vy?: number
}

const createDriftForce = () => {
    let nodes: DriftNode[] = []
    const force = (alpha: number) => {
        const t = performance.now() * 0.00035
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i]
            if (node.fx != null || node.fy != null) continue
            const seed = i * 12.9898
            node.vx = (node.vx ?? 0) + Math.sin(t + seed) * 1.2 * alpha
            node.vy = (node.vy ?? 0) + Math.cos(t * 0.9 + seed * 1.3) * 1.2 * alpha
        }
    }
    force.initialize = (initNodes: DriftNode[]) => {
        nodes = initNodes
    }
    return force
}

const asForceGraphNode = (node: GraphNodeObj): ForceGraphNode => ({
    id: String(node.id),
    name: String(node.name ?? ''),
    type: (node.type as GraphNodeType) ?? 'entry',
    degree: Number(node.degree ?? 0)
})

const asForceGraphLink = (link: GraphLinkObj): ForceGraphLink => {
    const { source, target } = linkEndpoints(link)
    return {
        id: String(link.id ?? `${source}|${target}|${link.type ?? 'edge'}`),
        source,
        target,
        type: link.type,
        weight: Number(link.weight ?? 1),
        reason: link.reason,
        manual: Boolean(link.manual)
    }
}

export const ForceGraphCanvas = ({
    data,
    selectedIds,
    selectedEdgeKey,
    reducedMotion,
    onNodeClick,
    onNodeDoubleClick,
    onEdgeClick,
    onPaneClick,
    onHoverNodeChange,
    graphRef: externalRef
}: ForceGraphCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const internalRef = useRef<GraphApi | undefined>(undefined)
    const fgRef = externalRef ?? internalRef

    const forces = useGraphSettings((s) => s.forces)
    const display = useGraphSettings((s) => s.display)
    const colors = useGraphSettings((s) => s.colors)
    const { colorScheme } = useMantineColorScheme()

    const [size, setSize] = useState({ width: 0, height: 0 })
    const [theme, setTheme] = useState<ThemePalette>(() => readThemePalette())
    const [hoverId, setHoverId] = useState<string | null>(null)

    const pointerRef = useRef({ x: 0, y: 0 })
    const lastClickRef = useRef<{ id: string; at: number } | null>(null)
    const clickTimerRef = useRef<number | null>(null)

    const neighborIds = useMemo(() => {
        if (!hoverId) return null
        const set = new Set<string>([hoverId])
        for (const link of data.links) {
            const { source, target } = linkEndpoints(link)
            if (source === hoverId) set.add(target)
            if (target === hoverId) set.add(source)
        }
        return set
    }, [hoverId, data.links])

    useEffect(() => {
        setTheme(readThemePalette())
    }, [colorScheme])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const update = () => {
            const rect = el.getBoundingClientRect()
            setSize({
                width: Math.max(0, Math.floor(rect.width)),
                height: Math.max(0, Math.floor(rect.height))
            })
        }
        update()
        const observer = new ResizeObserver(update)
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    const applyForces = useCallback(
        (
            api: GraphApi | undefined,
            nextForces: GraphForces,
            nextDisplay: GraphDisplay,
            reduce: boolean,
            options: { reheat: boolean }
        ) => {
            if (!api) return

            const charge = api.d3Force('charge') as { strength?: (v: number) => unknown } | undefined
            charge?.strength?.(-nextForces.repel)

            const link = api.d3Force('link') as
                | {
                      distance?: (v: number | ((l: GraphLinkObj) => number)) => unknown
                      strength?: (v: number) => unknown
                  }
                | undefined
            link?.distance?.((l) => nextForces.linkDistance + Math.min(Number(l.weight ?? 1), 3) * 14)
            link?.strength?.(nextForces.linkStrength)

            api.d3Force('center', null)
            api.d3Force('x', forceX(0).strength(nextForces.center) as never)
            api.d3Force('y', forceY(0).strength(nextForces.center) as never)
            api.d3Force(
                'collide',
                forceCollide<GraphNodeObj>()
                    .radius((node) => nodeRadius(node, nextDisplay.nodeSize) + 8)
                    .strength(0.7) as never
            )

            const shouldDrift = nextDisplay.drift && !reduce
            api.d3Force('drift', shouldDrift ? (createDriftForce() as never) : null)

            if (options.reheat) api.d3ReheatSimulation()
        },
        []
    )

    const forcesKey = `${forces.center}|${forces.repel}|${forces.linkStrength}|${forces.linkDistance}|${display.drift}|${display.nodeSize}|${reducedMotion}`
    const dataKey = useMemo(
        () =>
            `${data.nodes.map((node) => node.id).join(',')}|${data.links.map((link) => link.id).join(',')}`,
        [data]
    )
    const fittedDataKeyRef = useRef('')
    const hasSizedRef = useRef(false)

    const waitForApi = useCallback((onReady: (api: GraphApi) => boolean | void, maxTries = 60) => {
        let tries = 0
        const id = window.setInterval(() => {
            tries += 1
            const api = fgRef.current
            if (api) {
                const done = onReady(api)
                if (done !== false) {
                    window.clearInterval(id)
                    return
                }
            }
            if (tries >= maxTries) window.clearInterval(id)
        }, 50)
        return () => window.clearInterval(id)
    }, [fgRef])

    useEffect(() => {
        if (!size.width || !size.height) return
        return waitForApi((api) => {
            applyForces(api, forces, display, reducedMotion, { reheat: true })
        })
        // Reheat only when force-related settings change, not labels/colors
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applyForces, forcesKey, waitForApi, size.width, size.height])

    useEffect(() => {
        if (!size.width || !size.height) return
        return waitForApi((api) => {
            applyForces(api, forces, display, reducedMotion, { reheat: false })
        })
        // Apply forces to a freshly loaded graph without a hard reheat
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataKey, waitForApi, size.width, size.height])

    useEffect(() => {
        if (!size.width || !size.height) return

        const sizeJustReady = !hasSizedRef.current
        hasSizedRef.current = true
        const dataChanged = fittedDataKeyRef.current !== dataKey
        if (!sizeJustReady && !dataChanged) return

        return waitForApi((api) => {
            api.resumeAnimation()
            const bbox = api.getGraphBbox()
            const spanX = Math.abs((bbox?.x[1] ?? 0) - (bbox?.x[0] ?? 0))
            const spanY = Math.abs((bbox?.y[1] ?? 0) - (bbox?.y[0] ?? 0))
            // Wait until the layout has spread — early zoomToFit locks a broken transform
            if (data.nodes.length > 1 && spanX < 8 && spanY < 8) return false

            api.zoomToFit(reducedMotion ? 0 : 420, 48)
            fittedDataKeyRef.current = dataKey
        }, 80)
    }, [dataKey, data.nodes.length, size.width, size.height, reducedMotion, waitForApi])

    useEffect(
        () => () => {
            if (clickTimerRef.current != null) window.clearTimeout(clickTimerRef.current)
        },
        []
    )

    const handleNodeClick = useCallback(
        (node: GraphNodeObj, event: MouseEvent) => {
            const payload = asForceGraphNode(node)
            const now = Date.now()
            const prev = lastClickRef.current
            const isDouble = Boolean(prev && prev.id === payload.id && now - prev.at < DOUBLE_CLICK_MS)

            if (isDouble) {
                if (clickTimerRef.current != null) {
                    window.clearTimeout(clickTimerRef.current)
                    clickTimerRef.current = null
                }
                lastClickRef.current = null
                onNodeDoubleClick(payload)
                return
            }

            lastClickRef.current = { id: payload.id, at: now }
            if (clickTimerRef.current != null) window.clearTimeout(clickTimerRef.current)
            clickTimerRef.current = window.setTimeout(() => {
                clickTimerRef.current = null
                onNodeClick(payload, event)
            }, DOUBLE_CLICK_MS)
        },
        [onNodeClick, onNodeDoubleClick]
    )

    const paintNode = useCallback(
        (node: GraphNodeObj, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const id = String(node.id)
            const r = nodeRadius(node, display.nodeSize)
            const x = node.x ?? 0
            const y = node.y ?? 0
            const base = resolveNodeColor((node.type as GraphNodeType) ?? 'entry', colors, theme)
            const isSelected = selectedIds.includes(id)
            const dimmed = neighborIds != null && !neighborIds.has(id)
            const highlighted = neighborIds?.has(id) ?? false

            ctx.save()
            ctx.globalAlpha = dimmed ? 0.22 : highlighted ? 1 : 0.92

            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fillStyle = base
            ctx.fill()

            ctx.lineWidth = (isSelected ? 2.4 : 1.2) / globalScale
            ctx.strokeStyle = isSelected ? theme.entry : theme.card
            ctx.stroke()

            if (isSelected) {
                ctx.beginPath()
                ctx.arc(x, y, r + 3 / globalScale, 0, Math.PI * 2)
                ctx.strokeStyle = theme.entry
                ctx.lineWidth = 2 / globalScale
                ctx.stroke()
            }

            if (display.showLabels && globalScale >= display.labelFadeZoom) {
                const fade =
                    globalScale >= display.labelFadeZoom + 0.15
                        ? 1
                        : (globalScale - display.labelFadeZoom) / 0.15
                const name = String(node.name ?? '')
                const label = name.length > 22 ? `${name.slice(0, 20)}…` : name
                const fontSize = Math.max(10 / globalScale, 2.2)
                ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'top'
                ctx.globalAlpha = (dimmed ? 0.2 : 0.95) * fade
                ctx.fillStyle = theme.foreground
                ctx.fillText(label, x, y + r + 3 / globalScale)
            }

            ctx.restore()
        },
        [colors, display.labelFadeZoom, display.nodeSize, display.showLabels, neighborIds, selectedIds, theme]
    )

    const paintPointerArea = useCallback(
        (node: GraphNodeObj, color: string, ctx: CanvasRenderingContext2D) => {
            const r = nodeRadius(node, display.nodeSize) + 2
            ctx.beginPath()
            ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
        },
        [display.nodeSize]
    )

    const linkColor = useCallback(
        (link: GraphLinkObj) => {
            const mapped = asForceGraphLink(link)
            if (mapped.id === selectedEdgeKey) return theme.entry
            if (neighborIds && !neighborIds.has(mapped.source) && !neighborIds.has(mapped.target)) {
                return 'transparent'
            }
            if (neighborIds && (neighborIds.has(mapped.source) || neighborIds.has(mapped.target))) {
                return theme.entry
            }
            if (mapped.manual) return theme.entry
            return theme.hairline
        },
        [neighborIds, selectedEdgeKey, theme]
    )

    const linkWidthFn = useCallback(
        (link: GraphLinkObj) => {
            const mapped = asForceGraphLink(link)
            if (mapped.id === selectedEdgeKey) return display.linkWidth * 2.2
            if (mapped.manual) return display.linkWidth * 1.5
            return display.linkWidth
        },
        [display.linkWidth, selectedEdgeKey]
    )

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full"
            onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect()
                if (!rect) return
                pointerRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                }
            }}
        >
            {size.width > 0 && size.height > 0 && (
                <ForceGraph2D
                    ref={fgRef}
                    width={size.width}
                    height={size.height}
                    graphData={data}
                    backgroundColor="rgba(0,0,0,0)"
                    nodeId="id"
                    linkSource="source"
                    linkTarget="target"
                    nodeLabel={() => ''}
                    linkLabel={() => ''}
                    nodeCanvasObjectMode={() => 'replace'}
                    nodeCanvasObject={paintNode}
                    nodePointerAreaPaint={paintPointerArea}
                    nodeVal={(node) => Math.max(1, Number(node.degree ?? 0) + 1)}
                    linkColor={linkColor}
                    linkWidth={linkWidthFn}
                    linkVisibility={(link) => {
                        if (!neighborIds) return true
                        const { source, target } = linkEndpoints(link)
                        return neighborIds.has(source) || neighborIds.has(target)
                    }}
                    enableNodeDrag
                    enableZoomInteraction
                    enablePanInteraction
                    enablePointerInteraction
                    minZoom={0.15}
                    maxZoom={5}
                    cooldownTicks={display.drift && !reducedMotion ? Infinity : 120}
                    d3AlphaDecay={display.drift && !reducedMotion ? 0.018 : 0.0228}
                    d3VelocityDecay={0.55}
                    warmupTicks={60}
                    autoPauseRedraw={false}
                    onNodeClick={handleNodeClick}
                    onNodeHover={(node) => {
                        const next = node ? asForceGraphNode(node) : null
                        setHoverId(next?.id ?? null)
                        onHoverNodeChange?.(
                            next,
                            next ? { x: pointerRef.current.x, y: pointerRef.current.y } : null
                        )
                    }}
                    onNodeDragEnd={(node) => {
                        node.fx = undefined
                        node.fy = undefined
                    }}
                    onLinkClick={(link) => {
                        onEdgeClick(asForceGraphLink(link))
                    }}
                    onBackgroundClick={() => {
                        setHoverId(null)
                        onHoverNodeChange?.(null, null)
                        onPaneClick()
                    }}
                    showPointerCursor
                />
            )}
        </div>
    )
}
