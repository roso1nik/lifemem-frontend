/* eslint-disable react-perf/jsx-no-new-object-as-prop */
'use client'

import { useMantineColorScheme } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { FC, ReactNode, useEffect, useState } from 'react'
import 'dayjs/locale/ru'

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const { colorScheme } = useMantineColorScheme()
    useEffect(() => {
        document.documentElement.classList.toggle('dark', colorScheme === 'dark')
    }, [colorScheme])

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="hidden">{children}</div>
    }

    return (
        <>
            <DatesProvider settings={{ locale: 'ru' }}>{children}</DatesProvider>
        </>
    )
}
