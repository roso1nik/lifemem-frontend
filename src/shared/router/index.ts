export const ROUTES = {
    HOME_PAGE: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    CONFIRM_PAGE: '/confirm',
    FORGOT_PASSWORD: '/forgotpassword',
    ADMIN: '/admin',
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
    [ROUTES.LOGIN]: 'Login',
    [ROUTES.REGISTER]: 'Register',
    [ROUTES.CONFIRM_PAGE]: 'Confirm',
    [ROUTES.FORGOT_PASSWORD]: 'Forgot password',
    [ROUTES.ADMIN]: 'Admin',
    [ROUTES.NOT_ADMIN]: 'No access',
    [ROUTES.GRAPH]: 'Graph',
    [ROUTES.MAP]: 'Map',
    [ROUTES.PROFILE]: 'Profile',
    [ROUTES.ARCHIVE]: 'Archive'
} as const

export const ADMIN_ROUTES = [ROUTES.ADMIN] as const
