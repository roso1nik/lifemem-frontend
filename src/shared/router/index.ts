export const ROUTES = {
    HOME_PAGE: '/',
    WELCOME: '/welcome',
    LOGIN: '/login',
    REGISTER: '/register',
    CONFIRM_PAGE: '/confirm',
    FORGOT_PASSWORD: '/forgotpassword',
    ADMIN: '/admin',
    ADMIN_USERS: '/admin/users',
    ADMIN_SETTINGS: '/admin/settings',
    ADMIN_MODELS: '/admin/models',
    ADMIN_LOGS: '/admin/logs',
    ADMIN_AUTH_LOGS: '/admin/auth-logs',
    ADMIN_HEALTH: '/admin/health',
    NOT_ADMIN: '/not-admin',
    NOTE: (id: string) => `/note/${id}`,
    GRAPH: '/graph',
    MAP: '/map',
    PROFILE: '/profile',
    ARCHIVE: '/archive'
} as const

export type AppSection = 'graph' | 'map' | 'profile' | 'archive'

export const SECTION_ROUTES: Record<AppSection, string> = {
    graph: ROUTES.GRAPH,
    map: ROUTES.MAP,
    profile: ROUTES.PROFILE,
    archive: ROUTES.ARCHIVE
}

export const ROUTES_NAMES = {
    [ROUTES.HOME_PAGE]: 'Home',
    [ROUTES.WELCOME]: 'Welcome',
    [ROUTES.LOGIN]: 'Login',
    [ROUTES.REGISTER]: 'Register',
    [ROUTES.CONFIRM_PAGE]: 'Confirm',
    [ROUTES.FORGOT_PASSWORD]: 'Forgot password',
    [ROUTES.ADMIN]: 'Admin',
    [ROUTES.ADMIN_USERS]: 'Admin users',
    [ROUTES.ADMIN_SETTINGS]: 'Admin settings',
    [ROUTES.ADMIN_MODELS]: 'Admin models',
    [ROUTES.ADMIN_LOGS]: 'Admin logs',
    [ROUTES.ADMIN_AUTH_LOGS]: 'Admin auth logs',
    [ROUTES.ADMIN_HEALTH]: 'Admin health',
    [ROUTES.NOT_ADMIN]: 'No access',
    [ROUTES.GRAPH]: 'Graph',
    [ROUTES.MAP]: 'Map',
    [ROUTES.PROFILE]: 'Profile',
    [ROUTES.ARCHIVE]: 'Archive'
} as const

export const ADMIN_ROUTES = [
    ROUTES.ADMIN,
    ROUTES.ADMIN_USERS,
    ROUTES.ADMIN_SETTINGS,
    ROUTES.ADMIN_MODELS,
    ROUTES.ADMIN_LOGS,
    ROUTES.ADMIN_AUTH_LOGS,
    ROUTES.ADMIN_HEALTH
] as const
