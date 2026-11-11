'use client'

import { useEffect, useMemo, useRef } from 'react'
import {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
    type EdgeMouseHandler,
    type NodeMouseHandler
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './graph-flow.css'
import type { GraphEdge, GraphNode } from '@/entities/graph/api'
import { memoryEdgeTypes } from './graph-edges'
import { memoryNodeTypes } from './graph-nodes'
import { toFlowEdges, toFlowNodes, type MemoryEdge, type MemoryNode } from './map-graph'
import { layoutGraphNodes } from './use-force-layout'

type GraphCanvasInnerProps = {
    apiNodes: GraphNode[]
    apiEdges: GraphEdge[]
    selectedIds: string[]
    selectedEdgeKey: string | null
    reducedMotion: boolean
    onNodeClick: NodeMouseHandler<MemoryNode>
    onNodeDoubleClick: NodeMouseHandler<MemoryNode>
    onEdgeClick: EdgeMouseHandler<MemoryEdge>
    onPaneClick: () => void
}

const GraphCanvasInner = ({
    apiNodes,
    apiEdges,
    selectedIds,
    selectedEdgeKey,
    reducedMotion,
    onNodeClick,
    onNodeDoubleClick,
    onEdgeClick,
    onPaneClick
}: GraphCanvasInnerProps) => {
    const { fitView } = useReactFlow()
    const prevGraphKey = useRef('')

    const graphKey = useMemo(
        () =>
            `${apiNodes.map((n) => n.id).join(',')}|${apiEdges
                .map((e) => `${e.source}-${e.target}-${e.type}`)
                .join(',')}|${reducedMotion ? 1 : 0}`,
        [apiNodes, apiEdges, reducedMotion]
    )

    const laidOut = useMemo(() => {
        const base = toFlowNodes(apiNodes, [])
        return layoutGraphNodes(base, apiNodes, apiEdges, { reducedMotion })
    }, [graphKey, apiNodes, apiEdges, reducedMotion])

    const displayNodes = useMemo(
        () =>
            laidOut.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    selectedForLink: selectedIds.includes(node.id)
                }
            })),
        [laidOut, selectedIds]
    )

    const displayEdges = useMemo(
        () => toFlowEdges(apiEdges, selectedEdgeKey),
        [apiEdges, selectedEdgeKey]
    )

    const [nodes, setNodes, onNodesChange] = useNodesState<MemoryNode>(displayNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState<MemoryEdge>(displayEdges)

    useEffect(() => {
        setNodes((current) => {
            const posById = new Map(current.map((n) => [n.id, n.position]))
            return displayNodes.map((node) => ({
                ...node,
                position: posById.get(node.id) ?? node.position
            }))
        })
    }, [displayNodes, setNodes])

    useEffect(() => {
        setEdges(displayEdges)
    }, [displayEdges, setEdges])

    useEffect(() => {
        if (prevGraphKey.current === graphKey) return
        prevGraphKey.current = graphKey
        setNodes(displayNodes)
        setEdges(displayEdges)
        const id = window.setTimeout(() => {
            void fitView({ padding: 0.2, duration: reducedMotion ? 0 : 280 })
        }, 30)
        return () => window.clearTimeout(id)
        // Only re-fit when the graph payload changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graphKey])

    return (
        <ReactFlow
            className="memory-graph-flow"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={memoryNodeTypes}
            edgeTypes={memoryEdgeTypes}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodesConnectable={false}
            elementsSelectable
            panOnDrag
            zoomOnScroll
            minZoom={0.35}
            maxZoom={2.2}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: 'memory' }}
        >
            <Background
                variant={BackgroundVariant.Dots}
                gap={18}
                size={1}
                color="color-mix(in srgb, var(--foreground) 14%, transparent)"
            />
            <Controls showInteractive={false} />
            <MiniMap
                pannable
                zoomable
                nodeStrokeWidth={2}
                nodeColor={(node) =>
                    node.type === 'entry'
                        ? 'color-mix(in srgb, var(--primary) 70%, white)'
                        : 'color-mix(in srgb, var(--sage) 70%, white)'
                }
            />
        </ReactFlow>
    )
}

export type GraphCanvasProps = GraphCanvasInnerProps

export const GraphCanvas = (props: GraphCanvasProps) => (
    <ReactFlowProvider>
        <div className="h-[min(70vh,640px)] w-full">
            <GraphCanvasInner {...props} />
        </div>
    </ReactFlowProvider>
)
