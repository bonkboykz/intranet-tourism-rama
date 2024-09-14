import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import * as Sentry from "@sentry/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import "../css/app.css";

import "./bootstrap";
import "./Plugins/http";

const appName = import.meta.env.VITE_APP_NAME;

createInertiaApp({
    title: () => `${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),

    setup({ el, App, props }) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
