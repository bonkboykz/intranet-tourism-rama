import forms from "@tailwindcss/forms";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--primary-color)",
                    hover: "var(--primary-color-hover)",
                },
                secondary: {
                    DEFAULT: "var(--secondary-color)",
                    hover: "var(--secondary-color-hover)",
                },
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },

            boxShadow: {
                custom: "0px 0px 10px -5px rgba(0, 0, 0, 0.15)",
            },

            dropShadow: {
                custom: "2px 2px 4px rgba(0, 0, 0, 0.5);",
            },

            width: {
                comment: "600px",
            },

            gridTemplateColumns: {
                layout: "1fr 3fr 1fr", // Custom grid template for layout
            },
        },
    },

    plugins: [
        // eslint-disable-next-line no-undef
        require("tailwindcss-animate"),
        forms,
        // eslint-disable-next-line no-undef
        require("@tailwindcss/aspect-ratio"),
    ],
};
