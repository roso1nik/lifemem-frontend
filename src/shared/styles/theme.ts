import { CSSVariablesResolver, MantineColorsTuple, createTheme } from '@mantine/core'

/** Mist Aqua — primary CTA / focus */
const brandColors: MantineColorsTuple = [
    '#eaf5f7',
    '#d5ebf0',
    '#b0d7e0',
    '#8ac2cf',
    '#6fb1c1',
    '#5b9fb0',
    '#4f91a2',
    '#3f7a8a',
    '#2f6a78',
    '#1f5160'
]

/** Soft Sage — secondary / chips / success-soft */
const sageColors: MantineColorsTuple = [
    '#eaf4ee',
    '#d5e9dc',
    '#b3d4c0',
    '#90bfa3',
    '#7fa892',
    '#6e987f',
    '#5f9e7a',
    '#4d8264',
    '#3f6b55',
    '#2f5240'
]

const redColors: MantineColorsTuple = [
    '#fdecec',
    '#f9d4d4',
    '#f0a8a8',
    '#e67c7c',
    '#d95c5c',
    '#d04545',
    '#c93838',
    '#b02e2e',
    '#9a2828',
    '#7f1f1f'
]

const whiteColors: MantineColorsTuple = [
    '#ffffff',
    '#e8eeec',
    '#d0dad7',
    '#b5c3bf',
    '#9aada7',
    '#879c96',
    '#7d948d',
    '#6b807a',
    '#5c6f6a',
    '#4c5c58'
]

const systemFont =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export const theme = createTheme({
    primaryColor: 'brandColors',
    colors: {
        brandColors,
        sage: sageColors,
        green: sageColors,
        red: redColors,
        white: whiteColors
    },
    primaryShade: 5,
    radius: {
        xs: '8px',
        sm: '10px',
        md: '12px',
        lg: '14px',
        xl: '20px'
    },
    fontFamily: systemFont,
    headings: {
        fontFamily: systemFont,
        fontWeight: '600'
    },
    autoContrast: true,
    defaultRadius: 'md',
    cursorType: 'pointer',
    components: {
        Button: { defaultProps: { radius: 'md' } },
        TextInput: { defaultProps: { radius: 'md' } },
        PasswordInput: { defaultProps: { radius: 'md' } },
        Textarea: { defaultProps: { radius: 'md' } },
        ActionIcon: { defaultProps: { radius: 'md' } },
        Input: { defaultProps: { radius: 'md' } },
        Avatar: { defaultProps: { radius: 'xl' } }
    }
})

export const cssVariablesResolver: CSSVariablesResolver = () => ({
    variables: {
        '--app-shell-border-color': 'var(--hairline)',
        '--press-scale': '0.97'
    },
    light: {
        '--mantine-color-body': 'var(--background)',
        '--mantine-color-text': 'var(--foreground)',
        '--mantine-color-anchor': 'var(--primary)',
        '--mantine-color-default-border': 'var(--hairline)',
        '--mantine-color-dimmed': 'var(--muted-foreground)'
    },
    dark: {
        '--mantine-color-body': 'var(--background)',
        '--mantine-color-text': 'var(--foreground)',
        '--mantine-color-anchor': 'var(--primary)',
        '--mantine-color-default-border': 'var(--hairline)',
        '--mantine-color-dimmed': 'var(--muted-foreground)'
    }
})
