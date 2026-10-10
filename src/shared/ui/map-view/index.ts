'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { MapViewProps } from './map-view'

export type { MapViewClickCoords, MapViewMarker, MapViewMode, MapViewProps } from './map-view'

export const MapView = dynamic(() => import('./map-view').then((mod) => mod.MapView), {
    ssr: false,
    loading: () => null
}) as ComponentType<MapViewProps>
