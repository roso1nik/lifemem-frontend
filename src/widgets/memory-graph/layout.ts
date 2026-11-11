import type { GraphEdge, GraphNode } from '@/entities/graph/api'

export type LaidOutNode = GraphNode & { x: number; y: number }

const TYPE_RING: Record<GraphNode['type'], number> = {
    entry: 0.55,
    person: 0.82,
    place: 1
}

/** Deterministic circle packing by type; used when motion is reduced or for the initial seed. */
export const layoutStatic = (nodes: GraphNode[], width: number, height: number): LaidOutNode[] => {
    const cx = width / 2
    const cy = height / 2
    const maxR = Math.min(width, height) * 0.38
    const byType = new Map<GraphNode['type'], GraphNode[]>()
    for (const node of nodes) {
        const list = byType.get(node.type) ?? []
        list.push(node)
        byType.set(node.type, list)
    }

    const laid: LaidOutNode[] = []
    for (const [type, group] of byType) {
        const ring = TYPE_RING[type] * maxR
        const n = group.length
        group.forEach((node, index) => {
            const angle = (Math.PI * 2 * index) / Math.max(n, 1) - Math.PI / 2
            const jitter = ((index % 5) - 2) * 4
            laid.push({
                ...node,
                x: cx + Math.cos(angle) * (ring + jitter),
                y: cy + Math.sin(angle) * (ring + jitter)
            })
        })
    }
    return laid
}

/** Short force pass over a static seed — enough for readable clusters without a library. */
export const layoutForce = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    width: number,
    height: number,
    iterations = 80
): LaidOutNode[] => {
    const laid = layoutStatic(nodes, width, height)
    if (laid.length === 0) return laid

    const index = new Map(laid.map((node, i) => [node.id, i]))
    const cx = width / 2
    const cy = height / 2

    for (let iter = 0; iter < iterations; iter += 1) {
        const cooling = 1 - iter / iterations
        for (let i = 0; i < laid.length; i += 1) {
            for (let j = i + 1; j < laid.length; j += 1) {
                let dx = laid[i].x - laid[j].x
                let dy = laid[i].y - laid[j].y
                let dist = Math.hypot(dx, dy) || 0.01
                const minDist = 36
                if (dist < minDist) {
                    const push = ((minDist - dist) / dist) * 0.35 * cooling
                    dx *= push
                    dy *= push
                    laid[i].x += dx
                    laid[i].y += dy
                    laid[j].x -= dx
                    laid[j].y -= dy
                }
            }
        }

        for (const edge of edges) {
            const a = index.get(edge.source)
            const b = index.get(edge.target)
            if (a == null || b == null) continue
            const dx = laid[b].x - laid[a].x
            const dy = laid[b].y - laid[a].y
            const dist = Math.hypot(dx, dy) || 0.01
            const target = 90 + Math.min(edge.weight, 3) * 12
            const pull = ((dist - target) / dist) * 0.08 * cooling
            laid[a].x += dx * pull
            laid[a].y += dy * pull
            laid[b].x -= dx * pull
            laid[b].y -= dy * pull
        }

        for (const node of laid) {
            node.x += (cx - node.x) * 0.01
            node.y += (cy - node.y) * 0.01
            node.x = Math.min(width - 24, Math.max(24, node.x))
            node.y = Math.min(height - 24, Math.max(24, node.y))
        }
    }

    return laid
}
