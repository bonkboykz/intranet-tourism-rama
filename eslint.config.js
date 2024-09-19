import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            react: pluginReact,
            // import: pluginImport,
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            // "import/order": [
            //     "error",
            //     {
            //         groups: [
            //             ["builtin", "external"], // Built-in and external packages
            //             ["internal"], // Alias imports like '@/components'
            //             ["parent", "sibling", "index"], // Relative imports
            //             ["unknown"], // Handles imports that don’t fit other groups (no need for 'style')
            //         ],
            //         "newlines-between": "always",
            //         alphabetize: { order: "asc", caseInsensitive: true },
            //     },
            // ],
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        // Packages (React, Node modules, etc.)
                        ["^react", "^@?\\w"],

                        // Internal paths (alias imports starting with `@`)
                        ["^(@|@/components)(/.*|$)"],

                        // Relative imports (starting with `.`)
                        ["^\\."],

                        // Side effect imports, such as CSS
                        ["^.+\\.(css|scss|sass)$"],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",
            "react/react-in-jsx-scope": "off",
            "no-unused-vars": "warn",
            "react/prop-types": "off",
            "no-useless-escape": "off",
        },
    },
];
