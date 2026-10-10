'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPinned, NotebookText, Search, X } from 'lucide-react'
import { useDebouncedValue } from '@mantine/hooks'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlaceMap, usePlaceMapFilters, type PlaceMapItem } from '@/entities/place/api'
import { useWorkspaceNavigation } from '@/features/workspace-tabs'
import { Button, IconButton, Loader, Select, Surface, TextInput } from '@/shared/ui'
import { MapView, type MapViewMarker } from '@/shared/ui/map-view'
import { cn } from '@/shared/utils'

export const PlacesMap = () => {
    const t = useTranslations('home.mapPage')
    const tArchive = useTranslations('home.archive')
    const { goNote } = useWorkspaceNavigation()

    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebouncedValue(search.trim().toLowerCase(), 250)
    const [country, setCountry] = useState<string | null>(null)
    const [region, setRegion] = useState<string | null>(null)
    const [city, setCity] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const itemRefs = useRef(new globalThis.Map<string, HTMLLIElement>())

    const filtersQuery = usePlaceMapFilters()
    // Without a selected country the API treats `{}` as empty; send all known countries.
    const countriesForQuery = country
        ? [country]
        : (filtersQuery.data?.countries.map((item) => item.code) ?? undefined)

    const mapQuery = usePlaceMap({
        countries: countriesForQuery?.length ? countriesForQuery : undefined,
        regions: region ? [region] : undefined,
        cities: city ? [city] : undefined,
        enabled: filtersQuery.isSuccess || filtersQuery.isError
    })

    const places = mapQuery.data?.data ?? []

    const filteredPlaces = useMemo(() => {
        if (!debouncedSearch) return places
        return places.filter((place) => {
            const hay = `${place.name} ${place.fullName ?? ''}`.toLowerCase()
            return hay.includes(debouncedSearch)
        })
    }, [places, debouncedSearch])

    const selectedPlace = useMemo(
        () => places.find((place) => place.id === selectedId) ?? null,
        [places, selectedId]
    )

    const markers = useMemo<MapViewMarker[]>(
        () =>
            filteredPlaces.map((place) => ({
                id: place.id,
                latitude: Number(place.latitude),
                longitude: Number(place.longitude),
                label: place.name
            })),
        [filteredPlaces]
    )

    const boundsKey = `${country ?? ''}|${region ?? ''}|${city ?? ''}|${debouncedSearch}`

    useEffect(() => {
        setSelectedId(null)
    }, [country, region, city, debouncedSearch])

    useEffect(() => {
        if (!selectedId) return
        if (!places.some((place) => place.id === selectedId)) setSelectedId(null)
    }, [places, selectedId])

    useEffect(() => {
        if (!selectedId) return
        itemRefs.current.get(selectedId)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, [selectedId])

    const onSelect = (id: string) => setSelectedId(id)

    const onOpenEntry = (entry: PlaceMapItem['entries'][number]) => {
        goNote({ id: entry.id, title: entry.name.slice(0, 28) || t('noteFallback') })
    }

    const filterOptions = filtersQuery.data
    const hasActiveFilters = Boolean(country || region || city)
    const isInitialLoading =
        (filtersQuery.isLoading || mapQuery.isLoading) && !mapQuery.data
    const isError = mapQuery.isError || filtersQuery.isError
    const countryData = (filterOptions?.countries ?? []).map((item) => ({
        value: item.code,
        label: item.name
    }))
    const regionData = (filterOptions?.regions ?? []).map((item) => ({
        value: item,
        label: item
    }))
    const cityData = (filterOptions?.cities ?? []).map((item) => ({
        value: item,
        label: item
    }))

    return (
        <div className="flex h-[calc(100dvh-3.25rem)] min-h-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
            <div className="flex shrink-0 flex-col gap-1 px-0.5">
                <div className="flex items-center gap-2">
                    <span className="bg-sage/15 text-sage flex size-9 items-center justify-center rounded-2xl">
                        <MapPinned size={18} strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0">
                        <h1 className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                            {t('title')}
                        </h1>
                        <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{t('subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-4">
                <Surface
                    frost
                    className="relative order-1 min-h-[42vh] flex-1 overflow-hidden p-1.5 sm:min-h-[48vh] lg:order-2 lg:min-h-0"
                >
                    {isInitialLoading ? (
                        <div className="flex h-full min-h-[42vh] items-center justify-center lg:min-h-0">
                            <Loader variant="section" />
                        </div>
                    ) : (
                        <MapView
                            markers={markers}
                            selectedId={selectedId}
                            boundsKey={boundsKey}
                            onMarkerSelect={onSelect}
                            className="h-full min-h-[40vh] rounded-[1.1rem] lg:min-h-0"
                        />
                    )}
                </Surface>

                <Surface
                    frost
                    capsule
                    className="order-2 flex max-h-[46vh] w-full shrink-0 flex-col overflow-hidden lg:order-1 lg:max-h-none lg:w-88 xl:w-96"
                >
                    <div className="border-hairline shrink-0 space-y-2.5 border-b p-3">
                        <TextInput
                            value={search}
                            onChange={(event) => setSearch(event.currentTarget.value)}
                            placeholder={t('searchPlaceholder')}
                            aria-label={t('searchPlaceholder')}
                            leftSection={<Search size={16} />}
                        />

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                            <Select
                                label={t('filterCountry')}
                                placeholder={t('filterCountry')}
                                data={countryData}
                                value={country}
                                onChange={(value) => {
                                    setCountry(value)
                                    setRegion(null)
                                    setCity(null)
                                }}
                                clearable
                                searchable
                                nothingFoundMessage={tArchive('emptyPlaces')}
                                disabled={filtersQuery.isLoading}
                                comboboxProps={{ withinPortal: true }}
                            />
                            <Select
                                label={t('filterRegion')}
                                placeholder={t('filterRegion')}
                                data={regionData}
                                value={region}
                                onChange={(value) => {
                                    setRegion(value)
                                    setCity(null)
                                }}
                                clearable
                                searchable
                                nothingFoundMessage={tArchive('emptyPlaces')}
                                disabled={filtersQuery.isLoading}
                                comboboxProps={{ withinPortal: true }}
                            />
                            <Select
                                label={t('filterCity')}
                                placeholder={t('filterCity')}
                                data={cityData}
                                value={city}
                                onChange={setCity}
                                clearable
                                searchable
                                nothingFoundMessage={tArchive('emptyPlaces')}
                                disabled={filtersQuery.isLoading}
                                comboboxProps={{ withinPortal: true }}
                            />
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <p className="text-muted-foreground text-[11px] leading-snug">
                                {t('placesCount', {
                                    count: filteredPlaces.length,
                                    onMap: markers.length
                                })}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="text-primary text-[11px] font-medium tracking-tight"
                                    onClick={() => {
                                        setCountry(null)
                                        setRegion(null)
                                        setCity(null)
                                    }}
                                >
                                    {t('clearFilters')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-1.5 sm:p-2">
                        {isInitialLoading ? (
                            <Loader variant="section" />
                        ) : isError ? (
                            <div className="px-3 py-8 text-center">
                                <p className="text-muted-foreground text-sm">{tArchive('error')}</p>
                            </div>
                        ) : filteredPlaces.length === 0 ? (
                            <div className="flex flex-col items-center px-4 py-10 text-center">
                                <span className="bg-sage/15 text-sage mb-3 flex size-12 items-center justify-center rounded-2xl">
                                    <MapPinned size={22} strokeWidth={1.6} />
                                </span>
                                <p className="text-sm font-medium tracking-tight">{t('emptyTitle')}</p>
                                <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-relaxed">
                                    {t('emptyHint')}
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col">
                                {filteredPlaces.map((place, index) => {
                                    const selected = selectedId === place.id
                                    return (
                                        <motion.li
                                            key={place.id}
                                            ref={(node) => {
                                                if (node) itemRefs.current.set(place.id, node)
                                                else itemRefs.current.delete(place.id)
                                            }}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                type: 'spring',
                                                bounce: 0,
                                                duration: 0.32,
                                                delay: Math.min(index * 0.02, 0.2)
                                            }}
                                            className="border-hairline border-b last:border-b-0"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => onSelect(place.id)}
                                                className={cn(
                                                    'flex w-full items-start gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-[transform,background-color] duration-100',
                                                    'active:scale-[0.97]',
                                                    'hover:bg-[color-mix(in_srgb,var(--sage)_7%,transparent)]',
                                                    selected &&
                                                        'bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] ring-1 ring-[color-mix(in_srgb,var(--primary)_28%,transparent)]'
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl',
                                                        selected
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-sage/18 text-sage ring-1 ring-[color-mix(in_srgb,var(--sage)_22%,transparent)]'
                                                    )}
                                                >
                                                    <MapPinned size={18} strokeWidth={1.7} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="text-foreground block truncate text-[15px] leading-snug font-medium tracking-tight">
                                                        {place.name}
                                                    </span>
                                                    {place.fullName && (
                                                        <span className="text-muted-foreground mt-0.5 block truncate text-xs leading-snug">
                                                            {place.fullName}
                                                        </span>
                                                    )}
                                                    <span className="text-sage mt-1 block text-[11px] font-medium">
                                                        {t('entriesCount', { count: place.entries.length })}
                                                    </span>
                                                </span>
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {selected && place.entries.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden px-2 pb-2"
                                                    >
                                                        <div className="bg-muted/35 border-hairline rounded-2xl border p-1.5">
                                                            <div className="mb-1 flex items-center justify-between px-1.5 pt-1">
                                                                <p className="text-muted-foreground text-[11px] font-medium tracking-tight">
                                                                    {t('entriesTitle')}
                                                                </p>
                                                                <IconButton
                                                                    size="sm"
                                                                    aria-label={t('closeEntries')}
                                                                    onClick={() => setSelectedId(null)}
                                                                >
                                                                    <X size={14} />
                                                                </IconButton>
                                                            </div>
                                                            <ul className="flex flex-col gap-0.5">
                                                                {place.entries.map((entry) => (
                                                                    <li key={entry.id}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onOpenEntry(entry)}
                                                                            className="hover:bg-card/80 active:scale-[0.98] flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-[transform,background-color] duration-100"
                                                                        >
                                                                            <NotebookText
                                                                                size={14}
                                                                                className="text-primary shrink-0"
                                                                            />
                                                                            <span className="text-foreground min-w-0 flex-1 truncate text-[13px] leading-snug">
                                                                                {entry.name || t('noteFallback')}
                                                                            </span>
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {selected && place.entries.length === 0 && (
                                                <p className="text-muted-foreground px-4 pb-3 text-xs">
                                                    {t('emptyEntries')}
                                                </p>
                                            )}
                                        </motion.li>
                                    )
                                })}
                            </ul>
                        )}

                        {selectedPlace && selectedPlace.entries.length > 1 && (
                            <div className="border-hairline sticky bottom-0 mt-2 border-t bg-[color-mix(in_srgb,var(--card)_88%,transparent)] p-2 backdrop-blur-md">
                                <Button
                                    fullWidth
                                    size="sm"
                                    variant="subtle"
                                    onClick={() => onOpenEntry(selectedPlace.entries[0])}
                                >
                                    {t('openFirstNote')}
                                </Button>
                            </div>
                        )}
                    </div>
                </Surface>
            </div>
        </div>
    )
}
