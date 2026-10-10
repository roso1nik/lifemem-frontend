'use client'

import { useEffect, useRef } from 'react'
import { useMantineColorScheme } from '@mantine/core'
import {
    config,
    GeoJSONSource,
    getVersion,
    LngLatBounds,
    Map as MapLibreMap,
    Marker,
    NavigationControl,
    setWorkerUrl,
    type MapLayerMouseEvent,
    type MapGeoJSONFeature,
    type MapMouseEvent
} from 'maplibre-gl'
import type { FeatureCollection, Point } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import { cn } from '@/shared/utils'
import classes from './map-view.module.css'

const SOURCE_ID = 'places'
const LAYER_CLUSTERS = 'places-clusters'
const LAYER_CLUSTER_COUNT = 'places-cluster-count'
const LAYER_POINTS = 'places-points'
const configureMapLibreWorker = () => {
    const workerUrl = `${window.location.origin}/vendor/maplibre-gl/${getVersion()}/maplibre-gl-csp-worker.js`
    setWorkerUrl(workerUrl)
    config.WORKER_URL = workerUrl
}

const STYLE_LIGHT = 'https://tiles.openfreemap.org/styles/liberty'
const STYLE_DARK = 'https://tiles.openfreemap.org/styles/dark'
const DEFAULT_CENTER: [number, number] = [37.6173, 55.7558]
const DEFAULT_ZOOM = 3
const SELECTED_ZOOM = 13

export type MapViewMode = 'view' | 'pick'

export type MapViewMarker = {
    id: string
    latitude: number
    longitude: number
    label?: string
}

export type MapViewClickCoords = {
    latitude: number
    longitude: number
}

export type MapViewProps = {
    markers?: MapViewMarker[]
    draftMarkers?: MapViewMarker[]
    selectedId?: string | null
    mode?: MapViewMode
    /** Change to re-fit the viewport (e.g. search / filters). */
    boundsKey?: string
    onMarkerSelect?: (id: string) => void
    onDraftMarkerSelect?: (id: string) => void
    onDraftMarkerRemove?: (id: string) => void
    draftFocusLabel?: (index: number, label?: string) => string
    draftRemoveLabel?: (index: number, label?: string) => string
    onMapClick?: (coords: MapViewClickCoords) => void
    className?: string
}

const styleForScheme = (scheme: string) => (scheme === 'dark' ? STYLE_DARK : STYLE_LIGHT)

const readToken = (name: string, fallback: string) => {
    if (typeof window === 'undefined') return fallback
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    return value || fallback
}

const emptyImage = (size = 1) => ({
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4)
})

const markersToGeoJson = (markers: MapViewMarker[], selectedId: string | null): FeatureCollection<Point> => ({
    type: 'FeatureCollection',
    features: markers
        .filter(
            (marker) =>
                Number.isFinite(marker.latitude) &&
                Number.isFinite(marker.longitude) &&
                Math.abs(marker.latitude) <= 90 &&
                Math.abs(marker.longitude) <= 180
        )
        .map((marker) => ({
            type: 'Feature',
            properties: {
                id: marker.id,
                label: marker.label ?? marker.id,
                selected: marker.id === selectedId ? 1 : 0
            },
            geometry: {
                type: 'Point',
                coordinates: [Number(marker.longitude), Number(marker.latitude)]
            }
        }))
})

const fitToMarkers = (map: MapLibreMap, markers: MapViewMarker[]) => {
    const valid = markers.filter((m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude))
    if (valid.length === 0) {
        map.easeTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 0 })
        return
    }
    if (valid.length === 1) {
        map.easeTo({
            center: [valid[0].longitude, valid[0].latitude],
            zoom: SELECTED_ZOOM,
            duration: 0
        })
        return
    }
    const bounds = new LngLatBounds()
    for (const marker of valid) {
        bounds.extend([marker.longitude, marker.latitude])
    }
    map.fitBounds(bounds, { padding: 56, maxZoom: 12, duration: 0 })
}

const ensurePlacesLayers = (map: MapLibreMap, data: FeatureCollection<Point>, cluster: boolean) => {
    const sage = readToken('--sage', '#7fa892')
    const primary = readToken('--primary', '#5b9fb0')
    const card = readToken('--card', '#ffffff')
    const foreground = readToken('--card-foreground', '#1a2422')

    if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
            type: 'geojson',
            data,
            cluster,
            clusterMaxZoom: 14,
            clusterRadius: 52
        })
    } else {
        ;(map.getSource(SOURCE_ID) as GeoJSONSource).setData(data)
    }

    if (cluster && !map.getLayer(LAYER_CLUSTERS)) {
        map.addLayer({
            id: LAYER_CLUSTERS,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': sage,
                'circle-radius': ['step', ['get', 'point_count'], 18, 8, 22, 25, 28],
                'circle-opacity': 0.95,
                'circle-stroke-width': 2,
                'circle-stroke-color': card
            }
        })
    }

    if (cluster && !map.getLayer(LAYER_CLUSTER_COUNT)) {
        map.addLayer({
            id: LAYER_CLUSTER_COUNT,
            type: 'symbol',
            source: SOURCE_ID,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['to-string', ['get', 'point_count']],
                'text-size': 12
            },
            paint: {
                'text-color': foreground
            }
        })
    }

    if (!map.getLayer(LAYER_POINTS)) {
        map.addLayer({
            id: LAYER_POINTS,
            type: 'circle',
            source: SOURCE_ID,
            filter: cluster ? ['!', ['has', 'point_count']] : ['all'],
            paint: {
                'circle-color': ['case', ['==', ['to-number', ['get', 'selected']], 1], primary, sage],
                'circle-radius': ['case', ['==', ['to-number', ['get', 'selected']], 1], 10, 8],
                'circle-stroke-width': ['case', ['==', ['to-number', ['get', 'selected']], 1], 3, 2],
                'circle-stroke-color': card,
                'circle-opacity': 0.98
            }
        })
    }
}

type DraftPinHandlers = {
    onSelect?: (id: string) => void
    onRemove?: (id: string) => void
    focusLabel?: (index: number, label?: string) => string
    removeLabel?: (index: number, label?: string) => string
}

const clearDraftPins = (pins: Marker[]) => {
    for (const pin of pins) pin.remove()
    pins.length = 0
}

const syncDraftPins = (
    map: MapLibreMap,
    drafts: MapViewMarker[],
    selectedId: string | null,
    pins: Marker[],
    handlers: DraftPinHandlers
) => {
    clearDraftPins(pins)

    drafts.forEach((draft, index) => {
        if (
            !Number.isFinite(draft.latitude) ||
            !Number.isFinite(draft.longitude) ||
            Math.abs(draft.latitude) > 90 ||
            Math.abs(draft.longitude) > 180
        ) {
            return
        }

        const n = index + 1
        const selected = draft.id === selectedId
        const root = document.createElement('div')
        root.className = cn(classes.draftPin, selected && classes.draftPinSelected)

        const body = document.createElement('button')
        body.type = 'button'
        body.className = classes.draftPinBody
        body.textContent = String(n)
        body.setAttribute(
            'aria-label',
            handlers.focusLabel?.(n, draft.label) ?? `Place ${n}`
        )
        body.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            handlers.onSelect?.(draft.id)
        })

        const remove = document.createElement('button')
        remove.type = 'button'
        remove.className = classes.draftPinRemove
        remove.setAttribute(
            'aria-label',
            handlers.removeLabel?.(n, draft.label) ?? `Remove place ${n}`
        )
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        icon.setAttribute('width', '10')
        icon.setAttribute('height', '10')
        icon.setAttribute('viewBox', '0 0 24 24')
        icon.setAttribute('fill', 'none')
        icon.setAttribute('stroke', 'currentColor')
        icon.setAttribute('stroke-width', '2.4')
        icon.setAttribute('stroke-linecap', 'round')
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', 'M18 6 6 18M6 6l12 12')
        icon.append(path)
        remove.append(icon)
        remove.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            handlers.onRemove?.(draft.id)
        })

        const stem = document.createElement('span')
        stem.className = classes.draftPinStem
        stem.setAttribute('aria-hidden', 'true')

        const stopMapGesture = (event: Event) => event.stopPropagation()
        root.addEventListener('mousedown', stopMapGesture)
        root.addEventListener('touchstart', stopMapGesture, { passive: true })
        root.addEventListener('dblclick', stopMapGesture)

        root.append(body, remove, stem)

        if (selected && draft.label) {
            const label = document.createElement('span')
            label.className = classes.draftPinLabel
            label.textContent = draft.label
            root.append(label)
        }

        const marker = new Marker({ element: root, anchor: 'bottom' })
            .setLngLat([draft.longitude, draft.latitude])
            .addTo(map)
        pins.push(marker)
    })
}

export const MapView = ({
    markers = [],
    draftMarkers = [],
    selectedId = null,
    mode = 'view',
    boundsKey = '',
    onMarkerSelect,
    onDraftMarkerSelect,
    onDraftMarkerRemove,
    draftFocusLabel,
    draftRemoveLabel,
    onMapClick,
    className
}: MapViewProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<MapLibreMap | null>(null)
    const draftPinsRef = useRef<Marker[]>([])
    const onSelectRef = useRef(onMarkerSelect)
    const onDraftSelectRef = useRef(onDraftMarkerSelect)
    const onDraftRemoveRef = useRef(onDraftMarkerRemove)
    const draftFocusLabelRef = useRef(draftFocusLabel)
    const draftRemoveLabelRef = useRef(draftRemoveLabel)
    const onMapClickRef = useRef(onMapClick)
    const modeRef = useRef(mode)
    const markersSnapshotRef = useRef(markers)
    const draftSnapshotRef = useRef(draftMarkers)
    const selectedIdRef = useRef(selectedId)
    const lastBoundsKeyRef = useRef<string | null>(null)
    const hasInitialFitRef = useRef(false)
    const { colorScheme } = useMantineColorScheme()
    const resolvedScheme = colorScheme === 'auto' ? 'light' : colorScheme

    useEffect(() => {
        onSelectRef.current = onMarkerSelect
    }, [onMarkerSelect])

    useEffect(() => {
        onDraftSelectRef.current = onDraftMarkerSelect
    }, [onDraftMarkerSelect])

    useEffect(() => {
        onDraftRemoveRef.current = onDraftMarkerRemove
    }, [onDraftMarkerRemove])

    useEffect(() => {
        draftFocusLabelRef.current = draftFocusLabel
    }, [draftFocusLabel])

    useEffect(() => {
        draftRemoveLabelRef.current = draftRemoveLabel
    }, [draftRemoveLabel])

    useEffect(() => {
        onMapClickRef.current = onMapClick
    }, [onMapClick])

    useEffect(() => {
        modeRef.current = mode
        const map = mapRef.current
        if (!map) return
        map.getCanvas().style.cursor = mode === 'pick' ? 'crosshair' : ''
    }, [mode])

    useEffect(() => {
        markersSnapshotRef.current = markers
    }, [markers])

    useEffect(() => {
        draftSnapshotRef.current = draftMarkers
    }, [draftMarkers])

    useEffect(() => {
        selectedIdRef.current = selectedId
    }, [selectedId])

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return

        configureMapLibreWorker()

        const map = new MapLibreMap({
            container: containerRef.current,
            style: styleForScheme(resolvedScheme),
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            attributionControl: { compact: true }
        })
        map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
        mapRef.current = map
        map.getCanvas().style.cursor = modeRef.current === 'pick' ? 'crosshair' : ''

        map.on('styleimagemissing', (event) => {
            if (map.hasImage(event.id)) return
            map.addImage(event.id, emptyImage())
        })

        const onClusterClick = (event: MapLayerMouseEvent) => {
            if (modeRef.current === 'pick') return
            const feature = event.features?.[0] as MapGeoJSONFeature | undefined
            const clusterId = feature?.properties?.cluster_id
            const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined
            const geometry = feature?.geometry
            if (clusterId == null || !source || !geometry || geometry.type !== 'Point') return

            const center = geometry.coordinates as [number, number]
            source.getClusterExpansionZoom(clusterId).then((zoom) => {
                map.easeTo({ center, zoom })
            })
        }

        const onPointClick = (event: MapLayerMouseEvent) => {
            event.originalEvent.stopPropagation()
            const id = event.features?.[0]?.properties?.id
            if (typeof id === 'string') onSelectRef.current?.(id)
        }

        const onBackgroundClick = (event: MapMouseEvent) => {
            if (modeRef.current !== 'pick') return
            const layers = [LAYER_POINTS, LAYER_CLUSTERS].filter((id) => map.getLayer(id))
            if (layers.length) {
                const hits = map.queryRenderedFeatures(event.point, { layers })
                if (hits.length) return
            }
            onMapClickRef.current?.({
                latitude: event.lngLat.lat,
                longitude: event.lngLat.lng
            })
        }

        const draftHandlers = (): DraftPinHandlers => ({
            onSelect: (id) => onDraftSelectRef.current?.(id),
            onRemove: (id) => onDraftRemoveRef.current?.(id),
            focusLabel: (index, label) => draftFocusLabelRef.current?.(index, label) ?? `Place ${index}`,
            removeLabel: (index, label) => draftRemoveLabelRef.current?.(index, label) ?? `Remove place ${index}`
        })

        const setPointer = () => {
            if (modeRef.current === 'pick') return
            map.getCanvas().style.cursor = 'pointer'
        }
        const clearPointer = () => {
            map.getCanvas().style.cursor = modeRef.current === 'pick' ? 'crosshair' : ''
        }

        const bindInteractions = () => {
            if (map.getLayer(LAYER_CLUSTERS)) {
                map.on('click', LAYER_CLUSTERS, onClusterClick)
                map.on('mouseenter', LAYER_CLUSTERS, setPointer)
                map.on('mouseleave', LAYER_CLUSTERS, clearPointer)
            }
            if (map.getLayer(LAYER_POINTS)) {
                map.on('click', LAYER_POINTS, onPointClick)
                map.on('mouseenter', LAYER_POINTS, setPointer)
                map.on('mouseleave', LAYER_POINTS, clearPointer)
            }
            map.on('click', onBackgroundClick)
        }

        const unbindInteractions = () => {
            map.off('click', LAYER_CLUSTERS, onClusterClick)
            map.off('click', LAYER_POINTS, onPointClick)
            map.off('mouseenter', LAYER_CLUSTERS, setPointer)
            map.off('mouseleave', LAYER_CLUSTERS, clearPointer)
            map.off('mouseenter', LAYER_POINTS, setPointer)
            map.off('mouseleave', LAYER_POINTS, clearPointer)
            map.off('click', onBackgroundClick)
        }

        const syncLayers = () => {
            unbindInteractions()
            const cluster = modeRef.current === 'view'
            ensurePlacesLayers(
                map,
                markersToGeoJson(markersSnapshotRef.current, selectedIdRef.current),
                cluster
            )
            syncDraftPins(
                map,
                draftSnapshotRef.current,
                selectedIdRef.current,
                draftPinsRef.current,
                draftHandlers()
            )
            bindInteractions()

            const selected = selectedIdRef.current
            const list = [...markersSnapshotRef.current, ...draftSnapshotRef.current]
            if (selected) {
                const target = list.find((m) => m.id === selected)
                if (target) {
                    map.easeTo({
                        center: [target.longitude, target.latitude],
                        zoom: SELECTED_ZOOM,
                        duration: 0
                    })
                    hasInitialFitRef.current = true
                    return
                }
            }
            if (!hasInitialFitRef.current && list.length > 0) {
                fitToMarkers(map, list)
                hasInitialFitRef.current = true
            }
        }

        map.on('style.load', syncLayers)

        return () => {
            unbindInteractions()
            clearDraftPins(draftPinsRef.current)
            map.remove()
            mapRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const schemeMountedRef = useRef(false)
    useEffect(() => {
        if (!schemeMountedRef.current) {
            schemeMountedRef.current = true
            return
        }
        const map = mapRef.current
        if (!map) return
        hasInitialFitRef.current = false
        map.setStyle(styleForScheme(resolvedScheme))
    }, [resolvedScheme])

    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const apply = () => {
            ensurePlacesLayers(map, markersToGeoJson(markers, selectedId), mode === 'view')
            syncDraftPins(map, draftMarkers, selectedId, draftPinsRef.current, {
                onSelect: (id) => onDraftSelectRef.current?.(id),
                onRemove: (id) => onDraftRemoveRef.current?.(id),
                focusLabel: (index, label) =>
                    draftFocusLabelRef.current?.(index, label) ?? `Place ${index}`,
                removeLabel: (index, label) =>
                    draftRemoveLabelRef.current?.(index, label) ?? `Remove place ${index}`
            })

            if (selectedId) return

            const fitList = draftMarkers.length ? draftMarkers : markers
            const boundsChanged = lastBoundsKeyRef.current !== boundsKey
            if (boundsChanged) {
                lastBoundsKeyRef.current = boundsKey
                if (fitList.length > 0) {
                    fitToMarkers(map, fitList)
                    hasInitialFitRef.current = true
                } else {
                    // Don't lock initial fit on an empty first paint — markers may arrive next.
                    hasInitialFitRef.current = false
                    fitToMarkers(map, fitList)
                }
                return
            }

            if (!hasInitialFitRef.current && fitList.length > 0) {
                fitToMarkers(map, fitList)
                hasInitialFitRef.current = true
            }
        }

        if (map.isStyleLoaded()) {
            apply()
            return
        }

        map.once('style.load', apply)
        return () => {
            map.off('style.load', apply)
        }
    }, [markers, draftMarkers, selectedId, boundsKey, mode])

    useEffect(() => {
        const map = mapRef.current
        if (!map || !selectedId) return
        const target =
            draftMarkers.find((m) => m.id === selectedId) ?? markers.find((m) => m.id === selectedId)
        if (!target) return
        map.flyTo({
            center: [target.longitude, target.latitude],
            zoom: Math.max(map.getZoom(), SELECTED_ZOOM),
            essential: true,
            duration: 650
        })
    }, [selectedId, markers, draftMarkers])

    return (
        <div className={cn(classes.root, className)}>
            <div ref={containerRef} className={classes.canvas} />
        </div>
    )
}
