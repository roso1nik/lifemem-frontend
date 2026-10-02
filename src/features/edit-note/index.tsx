'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'
import { useUpdateEntry } from '@/entities/entry/api/use-update-entry'
import type { EntryLocationInput } from '@/entities/entry/api/use-create-entry'
import { PeoplePicker, PlacesPicker, type RelationOption } from '@/features/note-relations'
import { Button, TextInput } from '@/shared/ui'

type EditNoteFormProps = {
    entryId: string
    initialTitle: string
    initialPeople: RelationOption[]
    initialPlaces: RelationOption[]
    onSuccess?: () => void
    onCancel?: () => void
}

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
    const [people, setPeople] = useState<RelationOption[]>(initialPeople)
    const [places, setPlaces] = useState<RelationOption[]>(initialPlaces)
    const [location, setLocation] = useState<EntryLocationInput | null>(null)
    const [locating, setLocating] = useState(false)
    const { mutate, isPending } = useUpdateEntry()

    const placeSlots = places.length + (location ? 1 : 0)

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
                event.preventDefault()
                if (placeSlots > 3) {
                    toast.error(t('relations.placeLimit'))
                    return
                }
                mutate(
                    {
                        id: entryId,
                        data: {
                            title: title.trim(),
                            peoples: people.map((item) => item.id),
                            places: places.map((item) => item.id),
                            location: location ? [location] : undefined
                        }
                    },
                    { onSuccess: () => onSuccess?.() }
                )
            }}
        >
            <TextInput
                label={t('note.titleLabel')}
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                placeholder={t('note.titlePlaceholder')}
            />
            <PeoplePicker value={people} onChange={setPeople} />
            <PlacesPicker
                value={places}
                onChange={setPlaces}
                max={Math.max(0, 3 - (location ? 1 : 0))}
            />
            <div className="flex items-center gap-2">
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
                    <Button type="button" variant="ghost" size="sm" onClick={() => setLocation(null)}>
                        {t('note.clearLocation')}
                    </Button>
                )}
            </div>
            <p className="text-muted-foreground text-xs">{t('note.editHint')}</p>
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
