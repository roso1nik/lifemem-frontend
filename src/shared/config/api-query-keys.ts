export const ApiQueryKeys = {
    // Health
    HEALTH: 'health',

    // User
    USER: 'user',
    GET_SELF: 'get-self',
    UPDATE_SELF: 'update-self',
    USER_BINDINGS: 'user-bindings',
    REGISTER: 'register',
    CONFIRM_EMAIL: 'confirm-email',
    CONFIRM_PHONE: 'confirm-phone',
    ADD_PHONE: 'add-phone',
    ADD_EMAIL: 'add-email',
    SOFT_DELETE_USER: 'soft-delete-user',
    RESTORE_USER: 'restore-user',

    // Auth
    LOGIN: 'login',
    LOGOUT: 'logout',
    REFRESH: 'refresh',
    CONFIRM_PHONE_LOGIN: 'confirm-phone-login',
    GOOGLE_LOGIN: 'google-login',
    GOOGLE_LINK: 'google-link',
    GOOGLE_UNLINK: 'google-unlink',
    APPLE_LOGIN: 'apple-login',
    APPLE_LINK: 'apple-link',
    APPLE_UNLINK: 'apple-unlink',
    TELEGRAM_LOGIN: 'telegram-login',
    TELEGRAM_LINK: 'telegram-link',
    TELEGRAM_UNLINK: 'telegram-unlink',

    // Admin user
    ADMIN_USER_SEARCH: 'admin-user-search',
    ADMIN_USER_UPDATE: 'admin-user-update',
    ADMIN_USER_SOFT_DELETE: 'admin-user-soft-delete',
    ADMIN_USER_HARD_DELETE: 'admin-user-hard-delete',

    // Auth log
    AUTH_LOG_SEARCH: 'auth-log-search',

    // User settings
    USER_SETTINGS: 'user-settings',
    UPDATE_USER_SETTINGS: 'update-user-settings',

    // Service settings
    SERVICE_SETTINGS: 'service-settings',
    UPDATE_SERVICE_SETTINGS: 'update-service-settings',

    // AI model
    AI_MODEL_SEARCH: 'ai-model-search',
    AI_MODEL_UPDATE: 'ai-model-update',

    // Logs
    LOGS_SEARCH: 'logs-search',

    // Entry
    ENTRIES: 'entries',
    CREATE_ENTRY: 'create-entry',
    UPDATE_ENTRY: 'update-entry'
} as const
