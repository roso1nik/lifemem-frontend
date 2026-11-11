'use client'

import { memo } from 'react'
import { BaseEdge, getStraightPath, type EdgeProps } from '@xyflow/react'
import type { MemoryEdgeData } from './map-graph'

export const MemoryEdge = memo(
    ({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        selected,
        data
    }: EdgeProps) => {
        const edgeData = data as MemoryEdgeData | undefined
        const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY })
        const manual = Boolean(edgeData?.manual)
        const stroke = selected
            ? 'var(--primary)'
            : manual
              ? 'color-mix(in srgb, var(--primary) 55%, transparent)'
              : 'color-mix(in srgb, var(--foreground) 22%, transparent)'

        return (
            <BaseEdge
                id={id}
                path={path}
                style={{
                    stroke,
                    strokeWidth: selected ? 2.4 : manual ? 2 : 1.15,
                    cursor: 'pointer'
                }}
            />
        )
    }
)
MemoryEdge.displayName = 'MemoryEdge'

export const memoryEdgeTypes = {
    memory: MemoryEdge
}
