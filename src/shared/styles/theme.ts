import { CSSVariablesResolver, MantineColorsTuple, createTheme } from '@mantine/core'

/** Soft powder / sky blue — calm, easy on the eyes */
const brandColors: MantineColorsTuple = [
    '#f0f7fb',
    '#ddeef7',
    '#b8dced',
    '#8fc6e0',
    '#6bb0d1',
    '#549fc4',
    '#4894bb',
    '#3880a4',
    '#2f7293',
    '#1f5a76'
]

const secondaryColors: MantineColorsTuple = [
    '#f4f6f8',
    '#e8ecf0',
    '#cfd7df',
    '#b3bfcb',
    '#9aabbb',
    '#8b9faf',
    '#8398aa',
    '#708496',
    '#637586',
    '#526575'
]

const cyanColors: MantineColorsTuple = [
    '#e8f8fb',
    '#d3eff5',
    '#a6dee9',
    '#75ccdc',
    '#4fbdd0',
    '#38b4c8',
    '#28afc5',
    '#1299ae',
    '#00889c',
    '#007687'
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
    primaryShade: 5,
    radius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '22px'
    },
    fontFamily: 'var(--font), Inter, sans-serif',
    headings: {
        fontFamily: 'var(--font), Inter, sans-serif',
        fontWeight: '600'
    },
    autoContrast: true,
    defaultRadius: 'md',
    cursorType: 'pointer',
    components: {
        Button: {
            defaultProps: {
                radius: 'md'
            }
        },
        TextInput: {
            defaultProps: {
                radius: 'md'
            }
        },
        PasswordInput: {
            defaultProps: {
                radius: 'md'
            }
        },
        Textarea: {
            defaultProps: {
                radius: 'md'
            }
        },
        ActionIcon: {
            defaultProps: {
                radius: 'md'
            }
        },
        Input: {
            defaultProps: {
                radius: 'md'
            }
        }
    }
})

export const cssVariablesResolver: CSSVariablesResolver = () => ({
    variables: {
        '--app-shell-border-color': 'var(--border)'
    },
    light: {
        '--mantine-color-body': 'var(--background)',
        '--mantine-color-text': 'var(--foreground)',
        '--mantine-color-anchor': 'var(--mantine-color-brandColors-6)',
        '--mantine-color-default-border': 'var(--border)',
        '--mantine-color-dimmed': 'var(--muted-foreground)'
    },
    dark: {
        '--mantine-color-body': 'var(--background)',
        '--mantine-color-text': 'var(--foreground)',
        '--mantine-color-anchor': 'var(--mantine-color-brandColors-4)',
        '--mantine-color-default-border': 'var(--border)',
        '--mantine-color-dimmed': 'var(--muted-foreground)'
    }
})
