import type { Edge, Node } from '@xyflow/react'
import type { GraphEdge, GraphEdgeReason, GraphEdgeType, GraphNode, GraphNodeType } from '@/entities/graph/api'

export type MemoryNodeData = {
    name: string
    degree: number
    graphType: GraphNodeType
    selectedForLink: boolean
}

export type MemoryEdgeData = {
    edgeType: GraphEdgeType
    weight: number
    reason?: GraphEdgeReason
    manual: boolean
}

export type MemoryNode = Node<MemoryNodeData, GraphNodeType>
export type MemoryEdge = Edge<MemoryEdgeData>

export type ForceGraphNode = {
    id: string
    name: string
    type: GraphNodeType
    degree: number
}

export type ForceGraphLink = {
    id: string
    source: string
    target: string
    type: GraphEdgeType
    weight: number
    reason?: GraphEdgeReason
    manual: boolean
}

export type ForceGraphData = {
    nodes: ForceGraphNode[]
    links: ForceGraphLink[]
}

export const edgeKey = (edge: Pick<GraphEdge, 'source' | 'target' | 'type'>) =>
    `${edge.source}|${edge.target}|${edge.type}`

export const toFlowNodes = (nodes: GraphNode[], selectedIds: string[] = []): MemoryNode[] =>
    nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: { x: 0, y: 0 },
        data: {
            name: node.name,
            degree: node.degree,
            graphType: node.type,
            selectedForLink: selectedIds.includes(node.id)
        },
        draggable: true
    }))

export const toFlowEdges = (edges: GraphEdge[], selectedEdgeKey: string | null = null): MemoryEdge[] =>
    edges.map((edge) => {
        const id = edgeKey(edge)
        const manual = edge.type === 'entry_entry_manual' || Boolean(edge.reason?.manual)
        return {
            id,
            source: edge.source,
            target: edge.target,
            type: 'memory',
            selectable: true,
            data: {
                edgeType: edge.type,
                weight: edge.weight,
                reason: edge.reason,
                manual
            },
            selected: id === selectedEdgeKey
        }
    })

export const toGraphData = (nodes: GraphNode[], edges: GraphEdge[]): ForceGraphData => ({
    nodes: nodes.map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        degree: node.degree
    })),
    links: edges.map((edge) => {
        const manual = edge.type === 'entry_entry_manual' || Boolean(edge.reason?.manual)
        return {
            id: edgeKey(edge),
            source: edge.source,
            target: edge.target,
            type: edge.type,
            weight: edge.weight,
            reason: edge.reason,
            manual
        }
    })
})

export const buildLocalSubgraph = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    focusId: string,
    depth: 1 | 2
): { nodes: GraphNode[]; edges: GraphEdge[] } => {
    if (!nodes.some((node) => node.id === focusId)) {
        return { nodes: [], edges: [] }
    }

    const adjacency = new Map<string, Set<string>>()
    for (const edge of edges) {
        const from = adjacency.get(edge.source) ?? new Set<string>()
        const to = adjacency.get(edge.target) ?? new Set<string>()
        from.add(edge.target)
        to.add(edge.source)
        adjacency.set(edge.source, from)
        adjacency.set(edge.target, to)
    }

    const visited = new Set<string>([focusId])
    let frontier = [focusId]

    for (let d = 0; d < depth; d += 1) {
        const next: string[] = []
        for (const id of frontier) {
            for (const neighbor of adjacency.get(id) ?? []) {
                if (visited.has(neighbor)) continue
                visited.add(neighbor)
                next.push(neighbor)
            }
        }
        frontier = next
    }

    return {
        nodes: nodes.filter((node) => visited.has(node.id)),
        edges: edges.filter((edge) => visited.has(edge.source) && visited.has(edge.target))
    }
}

export const linkEndpoints = (link: { source: unknown; target: unknown }) => {
    const source =
        typeof link.source === 'object' && link.source && 'id' in link.source
            ? String((link.source as { id: string | number }).id)
            : String(link.source)
    const target =
        typeof link.target === 'object' && link.target && 'id' in link.target
            ? String((link.target as { id: string | number }).id)
            : String(link.target)
    return { source, target }
}
