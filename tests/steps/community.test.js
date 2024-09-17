import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Community Management", () => {
    // Scenario: View Community Groups
    test("User can view community groups", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the communities page
        await page.goto(`${baseUrl}/community`);

        // Check if community groups are visible
        const communityItems = page.locator(".community-item"); // Replace with actual selector
        const count = await communityItems.count();
        expect(count).toBeGreaterThan(0);
    });

    // Scenario: Admin adds a new community group
    test("Admin can add a new community group", async ({ page }) => {
        // Log in as a community admin
        await loginAs(page, "communityAdmin");

        // Navigate to the communities page
        await page.goto(`${baseUrl}/community`);

        // Add a new community group (assuming a form for adding groups)
        await page.click("#addCommunityButton"); // Replace with actual selector
        await page.fill("#communityName", "New Community Group");
        await page.fill(
            "#communityDescription",
            "Description of the new community group"
        );
        await page.click("#saveCommunityButton"); // Save the group

        // Verify that the group appears in the community list
        const newGroup = page.locator("text=New Community Group"); // Replace with actual selector
        expect(await newGroup.isVisible()).toBeTruthy();
    });

    // Scenario: Member posts in a community group
    test("Community member can post in a group", async ({ page }) => {
        // Log in as a community member
        await loginAs(page, "member");

        // Navigate to the community page
        await page.goto(`${baseUrl}/community`);

        // Click on the first community group
        await page.click(".community-item >> nth=0"); // Click on the first community group (replace selector)

        // Post in the community
        await page.fill("#postContent", "This is a new post in the community");
        await page.click("#postButton"); // Replace with actual selector

        // Verify that the post appears in the community feed
        const newPost = page.locator(
            "text=This is a new post in the community"
        ); // Replace with actual selector
        expect(await newPost.isVisible()).toBeTruthy();
    });
});
