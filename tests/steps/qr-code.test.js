import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Auto-generated QR Code", () => {
    // Scenario: Generate a QR code for a user profile
    test("User can generate a QR code for their profile", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the profile page
        await page.goto(`${baseUrl}/profile`);

        // Generate a QR code
        await page.click("#generateQRCodeButton"); // Replace with actual selector

        // Verify the QR code is displayed
        const qrCode = page.locator("#qrCodeImage"); // Replace with actual selector
        expect(await qrCode.isVisible()).toBeTruthy();
    });

    // Scenario: Scan a QR code to view the profile
    test("User can scan a QR code and view the correct profile page", async ({
        page,
    }) => {
        // Assuming we have a generated QR code link to test
        const qrCodeUrl = `${baseUrl}/profile?userId=12345`;

        // Scan the QR code (simulating by visiting the QR code URL directly)
        await page.goto(qrCodeUrl);

        // Verify that the correct profile page is loaded
        const profileHeader = await page.textContent(".profile-header"); // Replace with actual selector
        expect(profileHeader).toContain("User Profile");
    });
});
