import { expect, test } from "@playwright/test";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Departments Page", () => {
    // Scenario: View Departments List
    test("User can view departments list", async ({ page }) => {
        // Step 1: Given the user is logged in
        await page.goto(`${baseUrl}/login`);
        await page.fill("#username", "testuser"); // Replace with actual selector
        await page.fill("#password", "password"); // Replace with actual selector
        await page.click("button[type=submit]"); // Replace with actual selector

        // Verify that login was successful
        await expect(page).toHaveURL(`${baseUrl}/dashboard`);

        // Step 2: When the user navigates to the departments page
        await page.goto(`${baseUrl}/departments`);

        // Step 3: Then the user should see a list of all departments
        const departmentItems = page.locator(".department-item"); // Replace with actual selector
        const count = await departmentItems.count();
        expect(count).toBeGreaterThan(0);
    });

    // Scenario: View Department Details
    test("User can view department details", async ({ page }) => {
        // Step 1: Given the user is on the departments page
        await page.goto(`${baseUrl}/login`);
        await page.fill("#username", "testuser");
        await page.fill("#password", "password");
        await page.click("button[type=submit]");
        await expect(page).toHaveURL(`${baseUrl}/dashboard`);

        await page.goto(`${baseUrl}/departments`);

        // Step 2: When the user clicks on a specific department
        await page.click(".department-item >> nth=0"); // Click on the first department item

        // Step 3: Then the user should see the details of that department
        await expect(page).toHaveURL(/\/departments\/\d+/); // URL should match /departments/:id

        // Verify that department details are displayed
        const departmentName = await page.textContent(".department-name"); // Replace with actual selector
        expect(departmentName).not.toBeNull();
    });
});
