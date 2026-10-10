import type { GeocodingResult } from './types'

const PHOTON_BASE = 'https://photon.komoot.io'

/** Photon only accepts these `lang` values; others (e.g. `ru`) return 400. */
const PHOTON_LANGS = new Set(['default', 'de', 'en', 'fr'])

const toPhotonLang = (lang?: string): string => {
    if (!lang) return 'default'
    const normalized = lang.trim().toLowerCase().split('-')[0]
    return PHOTON_LANGS.has(normalized) ? normalized : 'default'
}

type PhotonFeature = {
    type: 'Feature'
    geometry?: { type: string; coordinates?: [number, number] }
    properties?: {
        osm_id?: number | string
        osm_type?: string
        name?: string
        street?: string
        housenumber?: string
        city?: string
        town?: string
        village?: string
        state?: string
        country?: string
        district?: string
        postcode?: string
    }
}

type PhotonResponse = {
    features?: PhotonFeature[]
}

const buildLabel = (properties: PhotonFeature['properties']): string => {
    if (!properties) return ''
    const locality = properties.city || properties.town || properties.village || properties.district
    const street = [properties.street, properties.housenumber].filter(Boolean).join(' ')
    const parts = [properties.name, street, locality, properties.state, properties.country].filter(
        (part): part is string => Boolean(part && part.trim())
    )
    return [...new Set(parts)].join(', ')
}

const featureToResult = (feature: PhotonFeature, index: number): GeocodingResult | null => {
    const coords = feature.geometry?.coordinates
    if (!coords || coords.length < 2) return null
    const [longitude, latitude] = coords
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
    const label = buildLabel(feature.properties) || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
    const id =
        feature.properties?.osm_type && feature.properties?.osm_id != null
            ? `${feature.properties.osm_type}:${feature.properties.osm_id}`
            : `photon-${latitude.toFixed(5)}-${longitude.toFixed(5)}-${index}`
    return { id, label, latitude, longitude }
}

export const searchAddress = async (
    query: string,
    options: { lang?: string; limit?: number; signal?: AbortSignal } = {}
): Promise<GeocodingResult[]> => {
    const q = query.trim()
    if (!q) return []

    const lang = toPhotonLang(options.lang)
    const params = new URLSearchParams({
        q,
        limit: String(options.limit ?? 8),
        lang
    })

    const res = await fetch(`${PHOTON_BASE}/api/?${params}`, {
        signal: options.signal,
        headers: { 'Accept-Language': options.lang?.trim() || lang }
    })
    if (!res.ok) throw new Error(`geocode_search_failed_${res.status}`)

    const json = (await res.json()) as PhotonResponse
    return (json.features ?? [])
        .map((feature, index) => featureToResult(feature, index))
        .filter((item): item is GeocodingResult => item != null)
}

export const reverseGeocode = async (
    latitude: number,
    longitude: number,
    options: { lang?: string; signal?: AbortSignal } = {}
): Promise<GeocodingResult | null> => {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

    const lang = toPhotonLang(options.lang)
    const params = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        lang
    })

    const res = await fetch(`${PHOTON_BASE}/reverse?${params}`, {
        signal: options.signal,
        headers: { 'Accept-Language': options.lang?.trim() || lang }
    })
    if (!res.ok) throw new Error(`geocode_reverse_failed_${res.status}`)

    const json = (await res.json()) as PhotonResponse
    const feature = json.features?.[0]
    if (!feature) {
        return {
            id: `coords-${latitude.toFixed(5)}-${longitude.toFixed(5)}`,
            label: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            latitude,
            longitude
        }
    }
    return featureToResult(feature, 0)
}
