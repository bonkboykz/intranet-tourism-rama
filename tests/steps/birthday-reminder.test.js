import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Birthday Reminder & Greetings", () => {
    // Scenario: View upcoming birthdays
    test("User can view upcoming birthdays", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the birthday reminder page
        await page.goto(`${baseUrl}/birthday-reminder`);

        // Check if upcoming birthdays are visible
        const birthdayItems = page.locator(".birthday-item"); // Replace with actual selector
        const count = await birthdayItems.count();
        expect(count).toBeGreaterThan(0);
    });

    // Scenario: Send a birthday greeting
    test("User can send a birthday greeting", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the birthday reminder page
        await page.goto(`${baseUrl}/birthday-reminder`);

        // Select a person with an upcoming birthday and send a greeting
        await page.click(".birthday-item >> nth=0"); // Click on the first birthday item (replace selector)
        await page.fill(
            "#greetingMessage",
            "Happy Birthday! Have a great day!"
        ); // Replace with actual selector
        await page.click("#sendGreetingButton"); // Replace with actual selector

        // Verify that the greeting was sent successfully
        const successMessage = await page.textContent(".success-message"); // Replace with actual selector
        expect(successMessage).toContain("Birthday greeting sent successfully");
    });
});
