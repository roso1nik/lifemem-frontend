import type { GraphNodeId } from './memory-graph'

/** Thumbnails only for the graph — each file is unique under /landing/nodes/ */
export const GRAPH_NODE_IMAGES: Record<GraphNodeId, string> = {
    park: '/landing/nodes/park.jpg',
    dasha: '/landing/nodes/dasha.jpg',
    cafe: '/landing/nodes/cafe.jpg',
    evening: '/landing/nodes/evening.jpg',
    max: '/landing/nodes/max.jpg'
}
