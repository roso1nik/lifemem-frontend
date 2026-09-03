'use client'

import { GoogleOAuthProviderWrapper } from '@/shared/lib/oauth'
import { PropsWithChildren } from 'react'

export const AuthOAuthProviders = ({ children }: PropsWithChildren) => {
    return <GoogleOAuthProviderWrapper>{children}</GoogleOAuthProviderWrapper>
}
