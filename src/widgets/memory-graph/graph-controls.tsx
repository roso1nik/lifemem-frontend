'use client'

import type { MutableRefObject } from 'react'
import { useTranslations } from 'next-intl'
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import type { ForceGraphMethods } from 'react-force-graph-2d'
import { IconButton, Surface } from '@/shared/ui'
import type { ForceGraphLink, ForceGraphNode } from './map-graph'

type GraphControlsProps = {
    graphRef: MutableRefObject<ForceGraphMethods<ForceGraphNode, ForceGraphLink> | undefined>
    reducedMotion: boolean
}

export const GraphControls = ({ graphRef, reducedMotion }: GraphControlsProps) => {
    const t = useTranslations('home.graphPage')
    const duration = reducedMotion ? 0 : 220

    return (
        <Surface
            frost
            capsule
            className="pointer-events-auto absolute bottom-3 right-3 z-10 flex flex-col overflow-hidden p-1"
        >
            <IconButton
                size="sm"
                aria-label={t('controls.zoomIn')}
                className="rounded-full"
                onClick={() => {
                    const api = graphRef.current
                    if (!api) return
                    api.zoom(api.zoom() * 1.25, duration)
                }}
            >
                <ZoomIn size={14} />
            </IconButton>
            <IconButton
                size="sm"
                aria-label={t('controls.zoomOut')}
                className="rounded-full"
                onClick={() => {
                    const api = graphRef.current
                    if (!api) return
                    api.zoom(api.zoom() / 1.25, duration)
                }}
            >
                <ZoomOut size={14} />
            </IconButton>
            <IconButton
                size="sm"
                aria-label={t('controls.fit')}
                className="rounded-full"
                onClick={() => graphRef.current?.zoomToFit(duration, 40)}
            >
                <Maximize2 size={14} />
            </IconButton>
        </Surface>
    )
}
