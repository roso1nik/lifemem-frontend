'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { MapPin, NotebookText, Users } from 'lucide-react'
import { cn } from '@/shared/utils'
import type { MemoryNodeData } from './map-graph'

const HiddenHandles = () => (
    <>
        <Handle
            type="source"
            position={Position.Top}
            className="!pointer-events-none !size-px !border-0 !bg-transparent !opacity-0"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
        <Handle
            type="target"
            position={Position.Top}
            className="!pointer-events-none !size-px !border-0 !bg-transparent !opacity-0"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        />
    </>
)

const MemoryNodeCard = ({
    data,
    tone
}: {
    data: MemoryNodeData
    tone: 'aqua' | 'sage'
}) => {
    const Icon = data.graphType === 'entry' ? NotebookText : data.graphType === 'person' ? Users : MapPin
    const size = 34 + Math.min(data.degree, 8) * 2

    return (
        <div
            className={cn(
                'border-hairline flex max-w-[148px] flex-col items-center gap-1.5 transition-transform active:scale-[0.97]',
                data.selectedForLink && 'scale-[1.02]'
            )}
        >
            <HiddenHandles />
            <span
                className={cn(
                    'flex items-center justify-center rounded-2xl shadow-[0_8px_24px_color-mix(in_srgb,var(--foreground)_6%,transparent)] ring-1',
                    tone === 'aqua' &&
                        'bg-primary/18 text-primary ring-[color-mix(in_srgb,var(--primary)_28%,transparent)]',
                    tone === 'sage' &&
                        'bg-sage/18 text-sage ring-[color-mix(in_srgb,var(--sage)_28%,transparent)]',
                    data.selectedForLink && 'ring-2 ring-[var(--primary)]'
                )}
                style={{ width: size, height: size }}
            >
                <Icon size={Math.max(14, size * 0.38)} strokeWidth={1.7} />
            </span>
            <span
                className={cn(
                    'bg-surface-frost/90 text-foreground border-hairline rounded-full border px-2 py-0.5 text-center text-[11px] leading-tight font-medium backdrop-blur-md',
                    data.selectedForLink && 'border-primary/40 text-primary'
                )}
            >
                {data.name.length > 22 ? `${data.name.slice(0, 20)}…` : data.name}
            </span>
        </div>
    )
}

export const EntryGraphNode = memo(({ data }: NodeProps) => (
    <MemoryNodeCard data={data as MemoryNodeData} tone="aqua" />
))
EntryGraphNode.displayName = 'EntryGraphNode'

export const PersonGraphNode = memo(({ data }: NodeProps) => (
    <MemoryNodeCard data={data as MemoryNodeData} tone="sage" />
))
PersonGraphNode.displayName = 'PersonGraphNode'

export const PlaceGraphNode = memo(({ data }: NodeProps) => (
    <MemoryNodeCard data={data as MemoryNodeData} tone="sage" />
))
PlaceGraphNode.displayName = 'PlaceGraphNode'

export const memoryNodeTypes = {
    entry: EntryGraphNode,
    person: PersonGraphNode,
    place: PlaceGraphNode
}
