import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("User Access Levels", () => {
    // Scenario: Verify superadmin access level
    test("Superadmin can manage all content and users", async ({ page }) => {
        // Log in as a superadmin
        await loginAs(page, "superadmin");

        // Navigate to the admin dashboard
        await page.goto(`${baseUrl}/admin/dashboard`);

        // Verify superadmin access to content and user management
        const manageContent = page.locator("text=Manage Content"); // Replace with actual selector
        const manageUsers = page.locator("text=Manage Users"); // Replace with actual selector
        expect(await manageContent.isVisible()).toBeTruthy();
        expect(await manageUsers.isVisible()).toBeTruthy();
    });

    // Scenario: Verify community admin access level
    test("Community admin can manage community-related content", async ({
        page,
    }) => {
        // Log in as a community admin
        await loginAs(page, "communityAdmin");

        // Navigate to the community management page
        await page.goto(`${baseUrl}/community`);

        // Verify community admin access to manage community content
        const manageCommunity = page.locator("text=Manage Community"); // Replace with actual selector
        expect(await manageCommunity.isVisible()).toBeTruthy();
    });

    // Scenario: Verify regular user access level
    test("Regular user can only manage their own content", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the user's profile
        await page.goto(`${baseUrl}/profile`);

        // Verify that the user can manage only their own content
        const ownContent = page.locator("text=My Content"); // Replace with actual selector
        const otherContent = page.locator("text=Other User Content"); // Replace with actual selector (assuming)
        expect(await ownContent.isVisible()).toBeTruthy();
        expect(await otherContent.isVisible()).toBeFalsy();
    });
});
