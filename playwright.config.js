import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests/steps",
    timeout: 30000,
    retries: 1,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        browser: "chromium",
    },
});
