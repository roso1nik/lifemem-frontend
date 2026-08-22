'use client'

import { MantineProvider } from '@mantine/core'
import { cssVariablesResolver, theme } from '@/shared/styles/theme'
import { ReactNode } from 'react'

export const MantineAppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
            {children}
        </MantineProvider>
    )
}
