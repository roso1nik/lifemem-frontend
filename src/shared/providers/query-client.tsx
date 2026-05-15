'use client'

import { QueryClient, QueryClientProvider, keepPreviousData } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PropsWithChildren, useState } from 'react'

const createOptimizedQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                retry: (failureCount, error: any) => {
                    if (error?.response?.status >= 400 && error?.response?.status < 500) {
                        return false
                    }
                    return failureCount < 2
                },
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                placeholderData: keepPreviousData,
                refetchOnWindowFocus: false,
                refetchOnReconnect: 'always',
                networkMode: 'offlineFirst'
            },
            mutations: {
                retry: (failureCount, error: any) => {
                    if (error?.response?.status >= 400 && error?.response?.status < 500) {
                        return false
                    }
                    return failureCount < 1
                },
                networkMode: 'offlineFirst'
            }
        }
    })

export function QueryProvider({ children }: PropsWithChildren) {
    const [queryClient] = useState(() => createOptimizedQueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    )
}
