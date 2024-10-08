import { useLayoutEffect } from "react";
import { usePage } from "@inertiajs/react";
import Color from "color";

export const useSetupTheme = () => {
    const { userTheme } = usePage().props;

    console.log("userTheme", userTheme);

    useLayoutEffect(() => {
        const root = document.documentElement;

        root.classList.add(userTheme);

        // Use requestAnimationFrame
        requestAnimationFrame(() => {
            const styles = getComputedStyle(root);
            const primaryColor = styles
                .getPropertyValue("--primary-color")
                .trim();
            const secondaryColor = styles
                .getPropertyValue("--secondary-color")
                .trim();

            const primaryHover = Color(primaryColor).darken(0.2).hex();
            const secondaryHover = Color(secondaryColor).darken(0.2).hex();

            root.style.setProperty("--primary-color-hover", primaryHover);
            root.style.setProperty("--secondary-color-hover", secondaryHover);
        });

        return () => {
            root.classList.remove(userTheme);

            // Use requestAnimationFrame
            requestAnimationFrame(() => {
                const root = document.documentElement;

                root.style.removeProperty("--primary-color-hover");
                root.style.removeProperty("--secondary-color-hover");
            });
        };
    }, [userTheme]);
};

export const useTheme = () => {
    const { userTheme } = usePage().props;

    return userTheme;
};
