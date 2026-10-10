'use client'

import { useState } from 'react'
import { MapPin, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useUpdateEntry } from '@/entities/entry/api/use-update-entry'
import type { EntryLocationInput } from '@/entities/entry/api/use-create-entry'
import { PlaceMapPicker, type PlaceMapSelection } from '@/features/place-map'
import { PeoplePicker, PlacesPicker, type RelationOption } from '@/features/note-relations'
import { Button, Surface, TextInput } from '@/shared/ui'

type EditNoteFormProps = {
    entryId: string
    initialTitle: string
    initialPeople: RelationOption[]
    initialPlaces: RelationOption[]
    onSuccess?: () => void
    onCancel?: () => void
}

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const toUuidList = (items: RelationOption[]): string[] =>
    items.map((item) => item.id.trim()).filter((id) => UUID_RE.test(id))

export const EditNoteForm = ({
    entryId,
    initialTitle,
    initialPeople,
    initialPlaces,
    onSuccess,
    onCancel
}: EditNoteFormProps) => {
    const t = useTranslations('home')
    const [title, setTitle] = useState(initialTitle)
    const [people, setPeople] = useState<RelationOption[]>(() =>
        initialPeople.filter((item) => item.id && item.name)
    )
    const [places, setPlaces] = useState<RelationOption[]>(() =>
        initialPlaces.filter((item) => item.id && item.name)
    )
    const [locations, setLocations] = useState<PlaceMapSelection[]>([])
    const [mapPickerOpen, setMapPickerOpen] = useState(false)
    const { mutateAsync, isPending } = useUpdateEntry()

    const placeSlots = places.length + locations.length

    return (
        <form
            className="flex flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault()
                if (placeSlots > 3) {
                    toast.error(t('relations.placeLimit'))
                    return
                }

                const peoples = toUuidList(people)
                const placeIds = toUuidList(places)

                if (people.length !== peoples.length || places.length !== placeIds.length) {
                    toast.error(t('relations.invalidIds'))
                    return
                }

                const locationPayload: EntryLocationInput[] = locations
                    .filter((item) => item.latitude != null && item.longitude != null)
                    .map(({ latitude, longitude, locationLabel }) => ({
                        latitude,
                        longitude,
                        ...(locationLabel ? { locationLabel } : {})
                    }))

                void mutateAsync({
                    id: entryId,
                    data: {
                        title: title.trim(),
                        peoples,
                        places: placeIds,
                        ...(locationPayload.length ? { location: locationPayload } : {})
                    }
                })
                    .then(() => onSuccess?.())
                    .catch(() => undefined)
            }}
        >
            <TextInput
                label={t('note.titleLabel')}
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                placeholder={t('note.titlePlaceholder')}
            />

            <div className="border-hairline flex flex-col gap-3 border-t pt-4">
                <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                    {t('note.editRelationsLabel')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Surface frost capsule className="p-3.5">
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
                            <Users size={12} strokeWidth={1.75} />
                            {t('relations.people')}
                        </div>
                        <PeoplePicker value={people} onChange={setPeople} hideLabel />
                    </Surface>
                    <Surface frost capsule className="p-3.5">
                        <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide uppercase">
                            <MapPin size={12} strokeWidth={1.75} />
                            {t('relations.places')}
                        </div>
                        <PlacesPicker
                            value={places}
                            onChange={setPlaces}
                            max={Math.max(0, 3 - locations.length)}
                            hideLabel
                            onOpenMap={() => {
                                if (places.length >= 3 && locations.length === 0) {
                                    toast.error(t('relations.placeLimit'))
                                    return
                                }
                                setMapPickerOpen(true)
                            }}
                        />
                        {locations.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {locations.map((item) => (
                                    <span
                                        key={item.clientId}
                                        className="bg-primary/12 text-primary inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                                    >
                                        <span className="truncate">{item.locationLabel || t('hintGeo')}</span>
                                        <button
                                            type="button"
                                            aria-label={t('relations.remove')}
                                            onClick={() =>
                                                setLocations((prev) =>
                                                    prev.filter((row) => row.clientId !== item.clientId)
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </Surface>
                </div>
                <p className="text-muted-foreground text-xs">{t('note.editHint')}</p>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="subtle" onClick={onCancel}>
                    {t('note.cancel')}
                </Button>
                <Button type="submit" loading={isPending}>
                    {t('note.save')}
                </Button>
            </div>

            <PlaceMapPicker
                opened={mapPickerOpen}
                onClose={() => setMapPickerOpen(false)}
                max={Math.max(0, 3 - places.length)}
                initial={locations}
                onConfirm={(selections) => setLocations(selections)}
            />
        </form>
    )
}
