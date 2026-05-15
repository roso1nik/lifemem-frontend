import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    allowedDevOrigins: [''],
    experimental: {
        optimizePackageImports: ['@mantine/core', '@mantine/hooks']
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
