'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { OAUTH_CONFIG } from '@/shared/config/oauth'
import { PropsWithChildren } from 'react'

export const GoogleOAuthProviderWrapper = ({ children }: PropsWithChildren) => {
    if (!OAUTH_CONFIG.googleClientId) {
        return <>{children}</>
    }

    return <GoogleOAuthProvider clientId={OAUTH_CONFIG.googleClientId}>{children}</GoogleOAuthProvider>
}
