import {
    forceCenter,
    forceCollide,
    forceLink,
    forceManyBody,
    forceSimulation,
    type SimulationLinkDatum,
    type SimulationNodeDatum
} from 'd3-force'
import type { GraphEdge, GraphNode, GraphNodeType } from '@/entities/graph/api'
import type { MemoryNode } from './map-graph'

type SimNode = SimulationNodeDatum & {
    id: string
    type: GraphNodeType
    degree: number
}

type SimLink = SimulationLinkDatum<SimNode> & {
    id: string
}

const TYPE_RING: Record<GraphNodeType, number> = {
    entry: 0.55,
    person: 0.82,
    place: 1
}

const layoutStaticPositions = (nodes: GraphNode[], width: number, height: number) => {
    const cx = width / 2
    const cy = height / 2
    const maxR = Math.min(width, height) * 0.38
    const byType = new Map<GraphNodeType, GraphNode[]>()

    for (const node of nodes) {
        const list = byType.get(node.type) ?? []
        list.push(node)
        byType.set(node.type, list)
    }

    const positions = new Map<string, { x: number; y: number }>()
    for (const [type, group] of byType) {
        const ring = TYPE_RING[type] * maxR
        const n = group.length
        group.forEach((node, index) => {
            const angle = (Math.PI * 2 * index) / Math.max(n, 1) - Math.PI / 2
            const jitter = ((index % 5) - 2) * 8
            positions.set(node.id, {
                x: cx + Math.cos(angle) * (ring + jitter),
                y: cy + Math.sin(angle) * (ring + jitter)
            })
        })
    }
    return positions
}

const applyPositions = (flowNodes: MemoryNode[], positions: Map<string, { x: number; y: number }>) =>
    flowNodes.map((node) => {
        const pos = positions.get(node.id) ?? { x: 0, y: 0 }
        return {
            ...node,
            position: { x: pos.x, y: pos.y }
        }
    })

export const layoutGraphNodes = (
    flowNodes: MemoryNode[],
    apiNodes: GraphNode[],
    apiEdges: GraphEdge[],
    options: { reducedMotion?: boolean; width?: number; height?: number } = {}
): MemoryNode[] => {
    const width = options.width ?? 960
    const height = options.height ?? 640
    if (!flowNodes.length) return flowNodes

    if (options.reducedMotion) {
        return applyPositions(flowNodes, layoutStaticPositions(apiNodes, width, height))
    }

    const seed = layoutStaticPositions(apiNodes, width, height)
    const simNodes: SimNode[] = apiNodes.map((node) => {
        const pos = seed.get(node.id) ?? { x: width / 2, y: height / 2 }
        return {
            id: node.id,
            type: node.type,
            degree: node.degree,
            x: pos.x,
            y: pos.y
        }
    })

    const nodeIndex = new Map(simNodes.map((node) => [node.id, node]))
    const simLinks: SimLink[] = apiEdges
        .filter((edge) => nodeIndex.has(edge.source) && nodeIndex.has(edge.target))
        .map((edge) => ({
            id: `${edge.source}|${edge.target}|${edge.type}`,
            source: nodeIndex.get(edge.source)!,
            target: nodeIndex.get(edge.target)!,
            weight: edge.weight
        }))

    const simulation = forceSimulation(simNodes)
        .force(
            'link',
            forceLink<SimNode, SimLink>(simLinks)
                .id((d) => d.id)
                .distance((link) => 90 + Math.min((link as SimLink & { weight?: number }).weight ?? 1, 3) * 14)
                .strength(0.45)
        )
        .force('charge', forceManyBody().strength(-280))
        .force('center', forceCenter(width / 2, height / 2))
        .force(
            'collide',
            forceCollide<SimNode>()
                .radius((d) => 28 + Math.min(d.degree, 8) * 2)
                .strength(0.85)
        )
        .stop()

    const ticks = Math.min(200, 80 + simNodes.length * 2)
    for (let i = 0; i < ticks; i += 1) simulation.tick()

    const positions = new Map(
        simNodes.map((node) => [
            node.id,
            {
                x: node.x ?? width / 2,
                y: node.y ?? height / 2
            }
        ])
    )

    return applyPositions(flowNodes, positions)
}
