import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Alerts & Notifications", () => {
    // Scenario: View notifications
    test("User can view notifications", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the notifications page
        await page.goto(`${baseUrl}/notifications`);

        // Check if notifications are visible
        const notificationItems = page.locator(".notification-item"); // Replace with actual selector
        const count = await notificationItems.count();
        expect(count).toBeGreaterThan(0);
    });

    // Scenario: Receive a new alert
    test("User can receive a new alert", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Simulate receiving a new alert (this would depend on the system triggering an alert)
        // For testing purposes, simulate navigating to an alert-triggering event
        await page.goto(`${baseUrl}/trigger-alert`); // Replace with actual action

        // Check if the alert appears in the notification center
        await page.goto(`${baseUrl}/notifications`);
        const newAlert = page.locator(
            '.notification-item:has-text("New Alert")'
        ); // Replace with actual text/selector
        expect(await newAlert.isVisible()).toBeTruthy();
    });
});
