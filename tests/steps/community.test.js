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
});
