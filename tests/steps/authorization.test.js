import { expect, test } from "@playwright/test";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Authorization", () => {
    test("User sucessfuly authenticates", async ({ page }) => {
        await page.goto(`${baseUrl}/login`);
        await page.waitForLoadState("domcontentloaded");

        const azureButton = page.locator("text=Login with Azure AD");

        await expect(azureButton).toBeVisible();

        const emailInput = page.locator("input[name='email']");
        const passwordInput = page.locator("input[name='password']");

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();

        await emailInput.fill("test@mail.com");
        await passwordInput.fill("123456");

        const submitButton = page.locator("text=Log in");

        await submitButton.click();

        await page.waitForURL(`${baseUrl}/dashboard`);
    });

    // // Scenario: Verify access as Superadmin
    // test("Superadmin should have access to all pages", async ({ page }) => {
    //     // Log in as a superadmin
    //     await loginAs(page, "superadmin");
    //     // Navigate to various restricted pages
    //     const restrictedPages = [
    //         `/admin/dashboard`,
    //         `/community`,
    //         `/departments`,
    //     ];
    //     for (const pagePath of restrictedPages) {
    //         await page.goto(`${baseUrl}${pagePath}`);
    //         expect(await page.url()).toContain(pagePath); // Ensure navigation succeeded
    //     }
    // });
    // // Scenario: Verify access as Community Admin
    // test("Community Admin should be able to manage community content", async ({
    //     page,
    // }) => {
    //     // Log in as a community admin
    //     await loginAs(page, "communityAdmin");
    //     // Navigate to the community management page
    //     await page.goto(`${baseUrl}/community`);
    //     // Verify community management access
    //     const manageCommunity = page.locator("text=Manage Community"); // Replace with actual selector
    //     expect(await manageCommunity.isVisible()).toBeTruthy();
    // });
    // // Scenario: Verify access as Department Admin
    // test("Department Admin should be able to manage department content", async ({
    //     page,
    // }) => {
    //     // Log in as a department admin
    //     await loginAs(page, "departmentAdmin");
    //     // Navigate to the department management page
    //     await page.goto(`${baseUrl}/departments`);
    //     // Verify department management access
    //     const manageDepartment = page.locator("text=Manage Department"); // Replace with actual selector
    //     expect(await manageDepartment.isVisible()).toBeTruthy();
    // });
    // // Scenario: Verify access as Regular User
    // test("Regular user should be denied access to admin pages", async ({
    //     page,
    // }) => {
    //     // Log in as a regular user
    //     await loginAs(page, "user");
    //     // Try to access the admin dashboard (restricted page)
    //     await page.goto(`${baseUrl}/admin/dashboard`);
    //     // Verify that access is denied
    //     const accessDeniedMessage = page.locator("text=Access Denied"); // Replace with actual selector
    //     expect(await accessDeniedMessage.isVisible()).toBeTruthy();
    // });
});
