import { BRAND, SITE_SHORT_NAME } from '@/shared/config/site'

type AppIconGraphicProps = {
    size: number
    maskable?: boolean
}

export function AppIconGraphic({ size, maskable = false }: AppIconGraphicProps) {
    const pad = maskable ? size * 0.22 : 0
    const inner = size - pad * 2
    const radius = maskable ? inner * 0.28 : size * 0.22
    const node = Math.max(inner * 0.09, 5)
    const graph = inner * 0.5
    const top = (inner - graph) / 2 + graph * 0.16
    const bottom = (inner - graph) / 2 + graph * 0.78
    const left = (inner - graph) / 2 + graph * 0.12
    const right = (inner - graph) / 2 + graph * 0.88
    const midX = inner / 2
    const stroke = Math.max(inner * 0.035, 3)

    return (
        <div
            style={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: maskable ? BRAND.themeColor : BRAND.backgroundColor
            }}
        >
            <div
                style={{
                    width: inner,
                    height: inner,
                    borderRadius: radius,
                    background: BRAND.themeColor,
                    display: 'flex',
                    position: 'relative'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: top + node / 2,
                        left,
                        width: right - left,
                        height: stroke,
                        background: '#ffffff',
                        borderRadius: 99
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: top + node / 2,
                        left: left + node / 2,
                        width: stroke,
                        height: bottom - top,
                        background: '#ffffff',
                        borderRadius: 99
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: top + node / 2,
                        left: right - node / 2 - stroke,
                        width: stroke,
                        height: bottom - top,
                        background: '#ffffff',
                        borderRadius: 99
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top,
                        left,
                        width: node,
                        height: node,
                        borderRadius: 99,
                        background: '#ffffff'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top,
                        left: right - node,
                        width: node,
                        height: node,
                        borderRadius: 99,
                        background: '#ffffff'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: bottom - node / 2,
                        left: midX - node / 2,
                        width: node,
                        height: node,
                        borderRadius: 99,
                        background: '#ffffff'
                    }}
                />
            </div>
        </div>
    )
}

export function OpenGraphGraphic({ tagline }: { tagline: string }) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 72,
                background: BRAND.backgroundColor,
                color: BRAND.foreground
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <div style={{ display: 'flex', width: 112, height: 112 }}>
                    <AppIconGraphic size={112} />
                </div>
                <div
                    style={{
                        fontSize: 56,
                        fontWeight: 600,
                        letterSpacing: -1.4,
                        textTransform: 'lowercase',
                        fontFamily: 'Georgia, "Times New Roman", serif'
                    }}
                >
                    {SITE_SHORT_NAME}
                </div>
            </div>
            <div
                style={{
                    fontSize: 36,
                    lineHeight: 1.35,
                    color: '#5C6B68',
                    maxWidth: 900,
                    fontFamily: 'ui-sans-serif, system-ui, sans-serif'
                }}
            >
                {tagline}
            </div>
            <div
                style={{
                    width: 120,
                    height: 8,
                    borderRadius: 99,
                    background: BRAND.sage
                }}
            />
        </div>
    )
}
