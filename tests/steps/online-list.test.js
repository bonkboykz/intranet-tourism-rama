import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Who Is Online List", () => {
    // Scenario: View the list of online users
    test("User can view the list of online users", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the "Who is Online" section
        await page.goto(`${baseUrl}/who-is-online`);

        // Verify that a list of online users is displayed
        const onlineUsers = page.locator(".online-user-item"); // Replace with actual selector
        const count = await onlineUsers.count();
        expect(count).toBeGreaterThan(0);
    });

    // Scenario: Check if a specific user is online
    test("User can check if a specific user is online", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the "Who is Online" section
        await page.goto(`${baseUrl}/who-is-online`);

        // Verify if a specific user is online
        const specificUser = page.locator("text=John Doe"); // Replace with actual username/selector
        expect(await specificUser.isVisible()).toBeTruthy();
    });
});
