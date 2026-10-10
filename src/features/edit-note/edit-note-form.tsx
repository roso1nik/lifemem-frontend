'use client'

import { useState } from 'react'
import { MapPin, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useUpdateEntry } from '@/entities/entry/api/use-update-entry'
import type { EntryLocationInput } from '@/entities/entry/api/use-create-entry'
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

const readCurrentLocation = (): Promise<EntryLocationInput> =>
    new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('geolocation_unavailable'))
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    locationLabel: undefined
                }),
            () => reject(new Error('geolocation_denied')),
            { enableHighAccuracy: true, timeout: 12_000 }
        )
    })

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
    const [location, setLocation] = useState<EntryLocationInput | null>(null)
    const [locating, setLocating] = useState(false)
    const { mutateAsync, isPending } = useUpdateEntry()

    const placeSlots = places.length + (location ? 1 : 0)

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

                void mutateAsync({
                    id: entryId,
                    data: {
                        title: title.trim(),
                        peoples,
                        places: placeIds,
                        ...(location && location.latitude != null && location.longitude != null
                            ? {
                                  location: [
                                      {
                                          latitude: location.latitude,
                                          longitude: location.longitude,
                                          ...(location.locationLabel
                                              ? { locationLabel: location.locationLabel }
                                              : {})
                                      }
                                  ]
                              }
                            : {})
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
                            max={Math.max(0, 3 - (location ? 1 : 0))}
                            hideLabel
                        />
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="subtle"
                                size="sm"
                                loading={locating}
                                onClick={() => {
                                    if (places.length >= 3) {
                                        toast.error(t('relations.placeLimit'))
                                        return
                                    }
                                    setLocating(true)
                                    void readCurrentLocation()
                                        .then((coords) => {
                                            setLocation({ ...coords, locationLabel: t('hintGeo') })
                                        })
                                        .catch(() => toast.error(t('geoError')))
                                        .finally(() => setLocating(false))
                                }}
                            >
                                {location ? t('note.locationSet') : t('attachGeo')}
                            </Button>
                            {location && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setLocation(null)}
                                >
                                    {t('note.clearLocation')}
                                </Button>
                            )}
                        </div>
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
        </form>
    )
}
