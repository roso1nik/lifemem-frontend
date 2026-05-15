import { createTheme, MantineColorsTuple } from '@mantine/core'

const brandColors: MantineColorsTuple = [
    '#e0fdf7',
    '#c2faf0',
    '#87f5e2',
    '#4cf0d4',
    '#12d7b5',
    '#0ec4a3',
    '#0bba95',
    '#00a382',
    '#009173',
    '#007d63'
]

const secondaryColors: MantineColorsTuple = [
    '#fffbe0',
    '#fff5cc',
    '#fce99c',
    '#fadd68',
    '#f9d648',
    '#f8cd1f',
    '#f7ca0b',
    '#dcb200',
    '#c49e00',
    '#a98800'
]

const cyanColors: MantineColorsTuple = [
    '#defeff',
    '#caf8ff',
    '#99efff',
    '#64e5ff',
    '#3dddfe',
    '#25d8fe',
    '#00d4ff',
    '#00bde4',
    '#00a8cc',
    '#0092b4'
]

const greenColors: MantineColorsTuple = [
    '#e7feef',
    '#d4f9e2',
    '#aaf0c4',
    '#7de8a4',
    '#57e189',
    '#40dd78',
    '#31db6e',
    '#22c55e',
    '#15ac50',
    '#009542'
]

const redColors: MantineColorsTuple = [
    '#ffe9e9',
    '#ffd1d2',
    '#f9a2a2',
    '#f47070',
    '#ef4444',
    '#ed2a2a',
    '#ec1a1c',
    '#d20b10',
    '#bc020c',
    '#a50007'
]

const whiteColors: MantineColorsTuple = [
    '#ffffff',
    '#e7e7e7',
    '#cdcdcd',
    '#b2b2b2',
    '#9a9a9a',
    '#8b8b8b',
    '#848484',
    '#717171',
    '#656565',
    '#575757'
]

export const theme = createTheme({
    primaryColor: 'brandColors',
    colors: {
        brandColors,
        violet: secondaryColors,
        cyan: cyanColors,
        green: greenColors,
        red: redColors,
        white: whiteColors
    },
    primaryShade: 8,
    radius: { xs: '10px', lg: '12px', md: '14px', sm: '16px', xl: '20px' },
    fontFamily: 'Inter, sans-serif',
    autoContrast: true,
    defaultRadius: 'md'
})
