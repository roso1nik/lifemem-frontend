import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    js.configs.recommended,
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "dist/**",
            ".git/**",
            "coverage/**",
            "next.config.mjs",
        ],
    },
    ...compat.extends("plugin:react/jsx-runtime"),
    ...compat.extends("plugin:@typescript-eslint/recommended"),
    ...compat.extends("plugin:import/recommended"),
    ...compat.extends("plugin:import/typescript"),
    ...compat.extends("plugin:react-hooks/recommended"),
    ...compat.extends("plugin:react-perf/recommended"),
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",

            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "react-hooks/set-state-in-effect": "off",

            "react-perf/jsx-no-new-function-as-prop": "warn", // Warn for new function as prop
            "react-perf/jsx-no-new-array-as-prop": "warn", // Warn for new array as prop
            "react-perf/jsx-no-new-object-as-prop": "warn", // Warn for new object as prop

            "import/no-unresolved": "off",
            "import/no-named-as-default": "off",

            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",
            "prefer-const": "error",
            "no-duplicate-imports": "off",
            "no-unused-expressions": "error",
            eqeqeq: ["error", "always", { null: "ignore" }],
            "max-len": [
                "warn",
                {
                    code: 300,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
        },
        settings: {
            react: {
                version: "detect",
            },
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },
    },
];
