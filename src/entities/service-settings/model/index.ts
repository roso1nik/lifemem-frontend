export interface AuthMethod {
    isRegistrationEnabled: boolean
    isLoginEnabled: boolean
    allowAllCountry: boolean
    countriesWhitelist: string[]
}

export interface AuthMethodsSettings {
    freshCall: AuthMethod
    google: AuthMethod
    apple: AuthMethod
    telegram: AuthMethod
    email: AuthMethod
}

export interface ModelTierSettings {
    premium: string | null
    lite: string | null
}

export type ModelProvider = 'Polza' | 'Openrouter'

export interface ModelsSettings {
    analyze: ModelTierSettings
    embedding: ModelTierSettings
    provider: ModelProvider
}

export interface ServiceSettingsJson {
    appVersion: number
    authMethods: AuthMethodsSettings
    models: ModelsSettings
}

export interface ServiceSettings {
    id: string
    createdAt: string
    updatedAt: string
    json: ServiceSettingsJson
}
