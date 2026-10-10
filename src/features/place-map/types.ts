import type { EntryLocationInput } from '@/entities/entry/api/use-create-entry'

export type PlaceMapSelection = EntryLocationInput & {
    clientId: string
}

export const toEntryLocations = (selections: PlaceMapSelection[]): EntryLocationInput[] =>
    selections
        .filter((item) => item.latitude != null && item.longitude != null)
        .map(({ latitude, longitude, locationLabel }) => ({
            latitude,
            longitude,
            ...(locationLabel ? { locationLabel } : {})
        }))
