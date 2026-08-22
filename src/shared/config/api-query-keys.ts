export const ApiQueryKeys = {
    USER: 'user',
    USER_SETTINGS: 'user-settings',
    UPDATE_USER_SETTINGS: 'update-user-settings',
    UPDATE_USER_PASSWORD: 'update-user-password',
    UPDATE_SELF: 'update-self',
    GET_SELF: 'get-self',

    LOGIN: 'login',
    LOGOUT: 'logout',
    REFRESH: 'refresh',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    FORGOT_PASSWORD_CONFIRM: 'forgot-password-confirm',
    FORGOT_PASSWORD_RESEND: 'forgot-password-resend',
    CONFIRM_EMAIL: 'confirm-email',
    CONFIRM_EMAIL_RESEND: 'confirm-email-resend',

    NOTES: 'notes',
    CREATE_NOTE: 'create-note'
} as const
