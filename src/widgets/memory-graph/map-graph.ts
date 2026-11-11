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

export const edgeKey = (edge: Pick<GraphEdge, 'source' | 'target' | 'type'>) =>
    `${edge.source}|${edge.target}|${edge.type}`

export const toFlowNodes = (
    nodes: GraphNode[],
    selectedIds: string[] = []
): MemoryNode[] =>
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
