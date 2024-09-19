import { expect, test } from "@playwright/test";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Profile Management and Gallery", () => {
    // Scenario: Update Profile Picture
    test("Update Profile Picture", async ({ page }) => {
        // Step 1: Given the user is on the login page
        await page.goto(`${baseUrl}/login`);

        // Step 2: When the user logs in with valid credentials
        await page.fill("#username", "testuser");
        await page.fill("#password", "password");
        await page.click("button[type=submit]");

        // Step 3: And the user navigates to the profile page
        await page.goto(`${baseUrl}/profile`);

        // Step 4: And the user uploads a new profile picture
        const [fileChooser] = await Promise.all([
            page.waitForEvent("filechooser"),
            page.click("#uploadProfilePicture"),
        ]);
        await fileChooser.setFiles("tests/assets/newProfilePicture.jpg");
        await page.click("#saveProfile");

        // Step 5: Then the profile picture is successfully updated
        const successMessage = await page.textContent(".success-message");
        expect(successMessage).toContain("Profile picture updated");
    });

    // Scenario: Add Picture to Gallery
    test("Add Picture to Gallery", async ({ page }) => {
        // Step 1: Given the user is on the profile gallery page
        await page.goto(`${baseUrl}/profile/gallery`);

        // Step 2: When the user uploads a new gallery picture
        const [fileChooser] = await Promise.all([
            page.waitForEvent("filechooser"),
            page.click("#uploadGalleryPicture"),
        ]);
        await fileChooser.setFiles("tests/assets/newGalleryPicture.jpg");
        await page.click("#saveGalleryPicture");

        // Step 3: Then the picture should be visible in the gallery
        const galleryImage = await page.isVisible(
            'img[src="/gallery/newGalleryPicture.jpg"]'
        );
        expect(galleryImage).toBeTruthy();
    });
});
