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
        return <div className="size-11" />
    }

    return (
        <ActionIcon
            variant="subtle"
            onClick={toggleTheme}
            size={44}
            color="gray"
            radius="md"
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground active:scale-[0.97]"
        >
            {colorScheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </ActionIcon>
    )
}
