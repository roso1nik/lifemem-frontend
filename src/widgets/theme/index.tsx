'use client'

import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export const ThemeSwitcher = () => {
    const { setColorScheme, colorScheme } = useMantineColorScheme()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', colorScheme === 'dark')
    }, [colorScheme])

    const toggleTheme = useCallback(() => {
        setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
    }, [colorScheme, setColorScheme])

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="hidden">Light</div>
    }

    return (
        <ActionIcon variant="transparent" onClick={toggleTheme} size="xl" color="light">
            {colorScheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </ActionIcon>
    )
}
