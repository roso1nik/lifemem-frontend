'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Loader as MantineLoader } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { MapPin, Search, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { usePlaceMap } from '@/entities/place/api'
import { reverseGeocode, searchAddress, type GeocodingResult } from '@/shared/lib/geocoding'
import { Button, TextInput } from '@/shared/ui'
import { MapView, type MapViewMarker } from '@/shared/ui/map-view'
import { cn } from '@/shared/utils'
import type { PlaceMapSelection } from './types'

export type PlaceMapPickerProps = {
    opened: boolean
    onClose: () => void
    max: number
    initial?: PlaceMapSelection[]
    onConfirm: (selections: PlaceMapSelection[]) => void
}

const newClientId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `loc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const resultToSelection = (result: GeocodingResult): PlaceMapSelection => ({
    clientId: newClientId(),
    latitude: result.latitude,
    longitude: result.longitude,
    locationLabel: result.label
})

export const PlaceMapPicker = ({
    opened,
    onClose,
    max,
    initial = [],
    onConfirm
}: PlaceMapPickerProps) => {
    const t = useTranslations('home.placeMap')
    const tRel = useTranslations('home.relations')
    const locale = useLocale()
    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebouncedValue(query.trim(), 320)
    const [results, setResults] = useState<GeocodingResult[]>([])
    const [searching, setSearching] = useState(false)
    const [picking, setPicking] = useState(false)
    const [selections, setSelections] = useState<PlaceMapSelection[]>(initial)
    const [focusId, setFocusId] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    const placesQuery = usePlaceMap({ enabled: opened })
    const userMarkers = useMemo<MapViewMarker[]>(
        () =>
            (placesQuery.data?.data ?? []).map((place) => ({
                id: place.id,
                latitude: place.latitude,
                longitude: place.longitude,
                label: place.name
            })),
        [placesQuery.data]
    )

    const draftMarkers = useMemo<MapViewMarker[]>(
        () =>
            selections
                .filter((item) => item.latitude != null && item.longitude != null)
                .map((item) => ({
                    id: item.clientId,
                    latitude: item.latitude as number,
                    longitude: item.longitude as number,
                    label: item.locationLabel
                })),
        [selections]
    )

    useEffect(() => {
        if (!opened) return
        setSelections(initial)
        setQuery('')
        setResults([])
        setFocusId(null)
    }, [opened, initial])

    useEffect(() => {
        if (!opened) return
        abortRef.current?.abort()
        if (!debouncedQuery) {
            setResults([])
            setSearching(false)
            return
        }

        const controller = new AbortController()
        abortRef.current = controller
        setSearching(true)
        void searchAddress(debouncedQuery, { lang: locale, signal: controller.signal })
            .then((items) => {
                if (!controller.signal.aborted) setResults(items)
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return
                setResults([])
                if (error instanceof Error && error.name === 'AbortError') return
                toast.error(t('searchError'))
            })
            .finally(() => {
                if (!controller.signal.aborted) setSearching(false)
            })

        return () => controller.abort()
    }, [debouncedQuery, locale, opened, t])

    const canAdd = selections.length < max

    const addSelection = (next: PlaceMapSelection) => {
        if (!canAdd) {
            toast.error(tRel('placeLimit'))
            return
        }
        const duplicate = selections.some(
            (item) =>
                item.latitude === next.latitude &&
                item.longitude === next.longitude &&
                (item.locationLabel ?? '') === (next.locationLabel ?? '')
        )
        if (duplicate) return
        setSelections((prev) => [...prev, next])
        setFocusId(next.clientId)
        setQuery('')
        setResults([])
    }

    const onPickResult = (result: GeocodingResult) => {
        addSelection(resultToSelection(result))
    }

    const onMapClick = (coords: { latitude: number; longitude: number }) => {
        if (!canAdd) {
            toast.error(tRel('placeLimit'))
            return
        }
        setPicking(true)
        void reverseGeocode(coords.latitude, coords.longitude, { lang: locale })
            .then((result) => {
                addSelection(
                    result
                        ? resultToSelection(result)
                        : {
                              clientId: newClientId(),
                              latitude: coords.latitude,
                              longitude: coords.longitude,
                              locationLabel: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                          }
                )
            })
            .catch(() => {
                addSelection({
                    clientId: newClientId(),
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    locationLabel: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                })
            })
            .finally(() => setPicking(false))
    }

    const onUserPlaceSelect = (placeId: string) => {
        const place = placesQuery.data?.data.find((item) => item.id === placeId)
        if (!place) return
        addSelection({
            clientId: newClientId(),
            latitude: place.latitude,
            longitude: place.longitude,
            locationLabel: place.fullName || place.name
        })
    }

    const removeSelection = (clientId: string) => {
        setSelections((prev) => prev.filter((row) => row.clientId !== clientId))
        setFocusId((current) => (current === clientId ? null : current))
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('title')}
            size="xl"
            centered
            classNames={{
                body: 'flex flex-col gap-3 pt-1',
                title: 'text-base font-semibold tracking-tight'
            }}
        >
            <p className="text-muted-foreground text-xs leading-relaxed">{t('hint')}</p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="relative min-w-0 flex-1">
                    <TextInput
                        value={query}
                        onChange={(event) => setQuery(event.currentTarget.value)}
                        placeholder={t('searchPlaceholder')}
                        leftSection={<Search size={16} />}
                        rightSection={searching ? <MantineLoader size={14} /> : null}
                        disabled={!canAdd}
                    />
                    {results.length > 0 && (
                        <ul className="border-hairline bg-card absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border p-1 shadow-lg">
                            {results.map((result) => (
                                <li key={result.id}>
                                    <button
                                        type="button"
                                        className="hover:bg-muted active:scale-[0.99] flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-sm"
                                        onClick={() => onPickResult(result)}
                                    >
                                        <MapPin size={14} className="text-sage mt-0.5 shrink-0" />
                                        <span className="min-w-0 flex-1 leading-snug">{result.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <p className="text-muted-foreground shrink-0 pt-2 text-[11px] sm:max-w-[9rem]">
                    {t('slotsLeft', { count: Math.max(0, max - selections.length) })}
                </p>
            </div>

            {selections.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selections.map((item, index) => (
                        <span
                            key={item.clientId}
                            className={cn(
                                'bg-primary/12 text-primary inline-flex max-w-full items-center gap-1.5 rounded-full py-1 pr-2 pl-1 text-xs',
                                focusId === item.clientId &&
                                    'ring-1 ring-[color-mix(in_srgb,var(--primary)_40%,transparent)]'
                            )}
                        >
                            <span className="bg-primary text-primary-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
                                {index + 1}
                            </span>
                            <button
                                type="button"
                                className="min-w-0 truncate text-left"
                                onClick={() => setFocusId(item.clientId)}
                            >
                                {item.locationLabel || t('unnamed')}
                            </button>
                            <button
                                type="button"
                                aria-label={t('removeMarker', { n: index + 1 })}
                                onClick={() => removeSelection(item.clientId)}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="border-hairline relative h-[42vh] min-h-[240px] overflow-hidden rounded-2xl border sm:h-[48vh]">
                {opened && (
                    <MapView
                        mode="pick"
                        markers={userMarkers}
                        draftMarkers={draftMarkers}
                        selectedId={focusId}
                        boundsKey={focusId ?? `draft-${draftMarkers.length}`}
                        onMarkerSelect={onUserPlaceSelect}
                        onDraftMarkerSelect={setFocusId}
                        onDraftMarkerRemove={removeSelection}
                        draftFocusLabel={(n) => t('focusMarker', { n })}
                        draftRemoveLabel={(n) => t('removeMarker', { n })}
                        onMapClick={onMapClick}
                        className="h-full rounded-2xl"
                    />
                )}
                {picking && (
                    <div className="bg-background/40 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
                        <MantineLoader size="sm" />
                    </div>
                )}
            </div>

            <p className="text-muted-foreground text-[10px] leading-snug">{t('attribution')}</p>

            <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="subtle" onClick={onClose}>
                    {t('cancel')}
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        onConfirm(selections)
                        onClose()
                    }}
                    disabled={selections.length === 0}
                >
                    {t('confirm', { count: selections.length })}
                </Button>
            </div>
        </Modal>
    )
}
