import { AxiosPromise } from 'axios'

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}

export type SortFields<T> = {
    [K in keyof T]?: SortOptions
}

export interface RequestData<T, F = RecursivePartial<T>, S = SortFields<T>> {
    pagination: Pagination
    filters: Partial<T | F>
    sorts?: RecursivePartial<T | S>
    query?: string
}

export interface ResponseApi<T> {
    count: number
    data: T
}

export type ResponseData<T> = AxiosPromise<ResponseApi<T>>

export const DEFAULT_PAGE_SIZE = 10
export const PLACEHOLDER_QUERY = { pagination: { count: DEFAULT_PAGE_SIZE, page: 1 }, filters: {}, sorts: {} }
export type SortOptions = 'ASC' | 'DESC' | null | undefined

export interface Pagination {
    count: number
    page: number
}

export const pageSizeOptions = [10, 20, 50, 100]

export type WithSearchParams<T extends string = never, K extends string = 'page' | 'pageSize'> = {
    searchParams?: Promise<
        {
            [P in K]: string
        } & {
            [P in T]?: string | string[]
        } & {
            [key: string]: string | string[] | undefined
        }
    >
}

export interface WithParams<T extends string | string[]> {
    params: Promise<
        {
            locale: string
        } & (T extends string
            ? Record<T, string>
            : T extends string[]
              ? { params: string[] } & Record<T[number], string>
              : never)
    >
}

export interface LocaleMessage {
    ru: string
    en: string
}

export interface RequestDataGet<TSortFields extends string = never> {
    page: number
    take: number
    q?: string
    sort?: GenerateSort<TSortFields>[]
}

export type SortOptionsGet = 'asc' | 'desc'
export type GenerateSort<T extends string> = `${T}:${SortOptionsGet}`

export const PLACEHOLDER_QUERY_GET: RequestDataGet = {
    page: 1,
    take: 50
}
export const PLACEHOLDER_QUERY_GET_COLLECTION_PROFILE: RequestDataGet = {
    page: 1,
    take: 10
}

export interface ErrorDto {
    code: string
    message: string
    meta?: string
}

export interface ErrorResponseDto {
    timestamp: number
    path: string
    errors: ErrorDto[]
}

export interface AlertBaseDto {
    message: string
    alert: boolean
}

export type SortDirection = 'ASC' | 'DESC'

export interface SearchRequest<TFilter = Record<string, unknown>, TSort = Record<string, SortDirection>> {
    filters?: Partial<TFilter>
    pagination: Pagination
    query?: string
    sorts?: Partial<TSort>
}

export type SearchResponse<T> = ResponseApi<T[]>
