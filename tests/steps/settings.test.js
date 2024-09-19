import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Settings (without theme selection)", () => {
    // Scenario: Update user profile information
    test("User can update their profile information", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the settings page
        await page.goto(`${baseUrl}/settings`);

        // Update profile information
        await page.fill("#firstName", "NewFirstName"); // Replace with actual selector
        await page.fill("#lastName", "NewLastName"); // Replace with actual selector
        await page.click("#saveProfileButton"); // Replace with actual selector

        // Verify that the changes are saved successfully
        const successMessage = await page.textContent(".success-message"); // Replace with actual selector
        expect(successMessage).toContain("Profile updated successfully");
    });

    // Scenario: Change password
    test("User can change their password", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the settings page
        await page.goto(`${baseUrl}/settings`);

        // Change password
        await page.fill("#currentPassword", "oldpassword"); // Replace with actual selector
        await page.fill("#newPassword", "newpassword"); // Replace with actual selector
        await page.fill("#confirmPassword", "newpassword"); // Replace with actual selector
        await page.click("#savePasswordButton"); // Replace with actual selector

        // Verify that the password was updated
        const successMessage = await page.textContent(".success-message"); // Replace with actual selector
        expect(successMessage).toContain("Password updated successfully");
    });

    // Scenario: Enable or disable notifications
    test("User can toggle notifications", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the settings page
        await page.goto(`${baseUrl}/settings`);

        // Toggle notifications
        const notificationCheckbox = page.locator("#notificationToggle"); // Replace with actual selector
        const isChecked = await notificationCheckbox.isChecked();
        if (isChecked) {
            await notificationCheckbox.uncheck();
        } else {
            await notificationCheckbox.check();
        }

        // Verify the notification settings are updated
        const successMessage = await page.textContent(".success-message"); // Replace with actual selector
        expect(successMessage).toContain("Notification settings updated");
    });
});
