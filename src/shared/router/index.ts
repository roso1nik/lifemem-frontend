export const ROUTES = {
    HOME_PAGE: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CONFIRM_PAGE: '/confirm',
    FORGOT_PASSWORD: '/forgotpassword',
    ADMIN: '/admin',
    NOT_ADMIN: '/not-admin'
} as const

export const ROUTES_NAMES = {
    [ROUTES.HOME_PAGE]: 'Home',
    [ROUTES.LOGIN]: 'Login',
    [ROUTES.REGISTER]: 'Register',
    [ROUTES.CONFIRM_PAGE]: 'Confirm',
    [ROUTES.FORGOT_PASSWORD]: 'Forgot password',
    [ROUTES.ADMIN]: 'Admin',
    [ROUTES.NOT_ADMIN]: 'No access'
} as const

export const ADMIN_ROUTES = [ROUTES.ADMIN] as const
