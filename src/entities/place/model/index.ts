export interface Place {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    fullName: string | null
    latitude: number | null
    longitude: number | null
    autodetected: boolean
}
