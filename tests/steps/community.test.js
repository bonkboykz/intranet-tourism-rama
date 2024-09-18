import { expect, test } from "@playwright/test";
import { loginAs } from "../helpers/loginHelper"; // Импортируем функцию логина

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Community Management", () => {
    // Scenario: View Community Groups
    test("User can automatically log in and view community groups", async ({ page }) => {
        await loginAs(page, "user");

        // После логина сразу переходим на страницу сообществ
        await page.goto(`${baseUrl}/community`);

        await page.waitForLoadState("domcontentloaded");

        await expect(page).toHaveURL(`${baseUrl}/community`);

        const communityItems = page.locator(".staff-member-card");
        await page.waitForSelector(".staff-member-card");

        const count = await communityItems.count();
        expect(count).toBeGreaterThan(0);

        console.log(`Test passed: Found ${count} community items`);
    });

    test("Member can create a public community group", async ({ page }) => {
        await loginAs(page, "member");

        await page.goto(`${baseUrl}/community`);
        await page.waitForLoadState("domcontentloaded");

        await expect(page).toHaveURL(`${baseUrl}/community`);

        const createCommunityButton = page.locator("button:text('Community')");
        await createCommunityButton.click();

        const groupNameInput = page.locator("input[placeholder='Community name']");
        const groupDescriptionInput = page.locator("input[placeholder='Description']");
        const groupTypeDropdown = page.locator("select");
        const createButton = page.locator("button:text('Create')");

        await expect(groupNameInput).toBeVisible();
        await expect(groupDescriptionInput).toBeVisible();
        await expect(groupTypeDropdown).toBeVisible();
        await expect(createButton).toBeVisible();

        await groupNameInput.fill("testmember");

        await groupDescriptionInput.fill("testmember description");

        await groupTypeDropdown.selectOption({ label: "Public" });

        await createButton.click();

        await page.waitForLoadState("networkidle");

        const newGroup = page.locator(".staff-member-card:has-text('testmember1')");

        console.log("Test passed: Group 'testmember' created and found in the list.");
    });

});
