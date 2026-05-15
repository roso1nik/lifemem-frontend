export const ApiQueryKeys = {
    USER: "user",
    USER_SETTINGS: "user-settings",
    UPDATE_USER_SETTINGS: "update-user-settings",
    UPDATE_USER_PASSWORD: "update-user-password",
    UPDATE_SELF: "update-self",
    GET_SELF: "get-self",

    LOGIN: "login",
    LOGOUT: "logout",
    REFRESH: "refresh",
    REGISTER: "register",
    FORGOT_PASSWORD: "forgot-password",
    FORGOT_PASSWORD_CONFIRM: "forgot-password-confirm",
    FORGOT_PASSWORD_RESEND: "forgot-password-resend",
    CONFIRM_EMAIL: "confirm-email",
    CONFIRM_EMAIL_RESEND: "confirm-email-resend",

    ROLE: "role",
    CREATE_ROLE: "create-role",
    UPDATE_ROLE: "update-role",
    DELETE_ROLE: "delete-role",

    PERMISSIONS: "permissions",
    GAME: "game",
    GAMES: "games",
    GAME_RATING: "game-rating",

    GAME_COLLECTION: "games-collections",
    GAME_COLLECTION_ADD: 'game-collection-add',
    GAME_COLLECTION_DELETE: "game-collection-delete",

    GAMES_ATTRIBUTES_NAMES: "games-attributes-names",

    GAMES_VISITS: "games-visits",
    PROFILE: "profile",

    GAMES_ATTRIBUTES: "games-attributes",

} as const;
