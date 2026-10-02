'use client'

import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { Loader as MantineLoader } from '@mantine/core'
import { Plus, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useListPersons, useCreatePerson } from '@/entities/person/api'
import { useListPlaces } from '@/entities/place/api'
import { Button, TextInput } from '@/shared/ui'
import { cn } from '@/shared/utils'

export type RelationOption = { id: string; name: string }

const isUsableId = (id: unknown): id is string => typeof id === 'string' && id.trim().length > 0

type PeoplePickerProps = {
    value: RelationOption[]
    onChange: (next: RelationOption[]) => void
    max?: number
}

export const PeoplePicker = ({ value, onChange, max = 10 }: PeoplePickerProps) => {
    const t = useTranslations('home.relations')
    const [query, setQuery] = useState('')
    const [debounced] = useDebouncedValue(query.trim(), 250)
    const { data, isFetching, isError } = useListPersons({
        query: debounced || undefined,
        count: 8
    })
    const { mutateAsync: createPerson, isPending } = useCreatePerson()

    const options = useMemo(() => {
        const selected = new Set(value.map((item) => item.id))
        return (data?.pages.flatMap((page) => page.data) ?? []).filter(
            (person) => isUsableId(person.id) && !selected.has(person.id)
        )
    }, [data, value])

    const canAdd = value.length < max

    const add = (person: RelationOption) => {
        if (!canAdd || !isUsableId(person.id)) return
        if (value.some((item) => item.id === person.id)) return
        onChange([...value, { id: person.id, name: person.name }])
        setQuery('')
    }

    const create = async () => {
        const name = query.trim()
        if (!name || !canAdd) return
        const person = await createPerson({ name })
        add({ id: person.id, name: person.name })
    }

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                {t('people')}
            </p>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((person) => (
                        <span
                            key={person.id}
                            className="bg-sage/15 text-sage inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                        >
                            {person.name}
                            <button
                                type="button"
                                aria-label={t('remove')}
                                onClick={() => onChange(value.filter((item) => item.id !== person.id))}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            {canAdd && (
                <div className="flex flex-col gap-1.5">
                    <TextInput
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                        placeholder={t('peoplePlaceholder')}
                        rightSection={isFetching ? <MantineLoader size={14} /> : null}
                    />
                    {isError && (
                        <p className="text-destructive text-xs">{t('loadError')}</p>
                    )}
                    {(options.length > 0 || query.trim()) && (
                        <ul className="border-hairline bg-card max-h-36 overflow-y-auto rounded-xl border p-1">
                            {options.map((person) => (
                                <li key={person.id}>
                                    <button
                                        type="button"
                                        className={cn(
                                            'hover:bg-muted w-full rounded-lg px-2.5 py-1.5 text-left text-sm',
                                            'active:scale-[0.99]'
                                        )}
                                        onClick={() => add({ id: person.id, name: person.name })}
                                    >
                                        {person.name}
                                    </button>
                                </li>
                            ))}
                            {query.trim() && (
                                <li>
                                    <Button
                                        type="button"
                                        variant="subtle"
                                        size="sm"
                                        className="w-full justify-start"
                                        leftSection={<Plus size={14} />}
                                        loading={isPending}
                                        onClick={() => void create()}
                                    >
                                        {t('createPerson', { name: query.trim() })}
                                    </Button>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

type PlacesPickerProps = {
    value: RelationOption[]
    onChange: (next: RelationOption[]) => void
    max?: number
}

export const PlacesPicker = ({ value, onChange, max = 3 }: PlacesPickerProps) => {
    const t = useTranslations('home.relations')
    const [query, setQuery] = useState('')
    const [debounced] = useDebouncedValue(query.trim(), 250)
    const { data, isFetching, isError } = useListPlaces({
        query: debounced || undefined,
        count: 8
    })

    const options = useMemo(() => {
        const selected = new Set(value.map((item) => item.id))
        return (data?.pages.flatMap((page) => page.data) ?? []).filter(
            (place) => isUsableId(place.id) && !selected.has(place.id)
        )
    }, [data, value])

    const canAdd = value.length < max

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
                {t('places')}
            </p>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map((place) => (
                        <span
                            key={place.id}
                            className="bg-sage/15 text-sage inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                        >
                            {place.name}
                            <button
                                type="button"
                                aria-label={t('remove')}
                                onClick={() => onChange(value.filter((item) => item.id !== place.id))}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            {canAdd && (
                <div className="flex flex-col gap-1.5">
                    <TextInput
                        value={query}
                        onChange={(e) => setQuery(e.currentTarget.value)}
                        placeholder={t('placesPlaceholder')}
                        rightSection={isFetching ? <MantineLoader size={14} /> : null}
                    />
                    {isError && (
                        <p className="text-destructive text-xs">{t('loadError')}</p>
                    )}
                    {options.length > 0 && (
                        <ul className="border-hairline bg-card max-h-36 overflow-y-auto rounded-xl border p-1">
                            {options.map((place) => (
                                <li key={place.id}>
                                    <button
                                        type="button"
                                        className="hover:bg-muted w-full rounded-lg px-2.5 py-1.5 text-left text-sm active:scale-[0.99]"
                                        onClick={() => {
                                            onChange([...value, { id: place.id, name: place.name }])
                                            setQuery('')
                                        }}
                                    >
                                        {place.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isFetching && !isError && debounced && options.length === 0 && (
                        <p className="text-muted-foreground text-xs">{t('placesEmptyHint')}</p>
                    )}
                </div>
            )}
        </div>
    )
}
