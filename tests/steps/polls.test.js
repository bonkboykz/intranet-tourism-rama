import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Polls", () => {
    // Scenario: Create a new poll
    test("Admin can create a new poll", async ({ page }) => {
        // Log in as an admin
        await loginAs(page, "departmentAdmin"); // Replace with admin role if necessary

        // Navigate to the polls page
        await page.goto(`${baseUrl}/polls`);

        // Create a new poll
        await page.click("#createPollButton"); // Replace with actual selector
        await page.fill("#pollTitle", "New Poll Title"); // Replace with actual selector
        await page.fill("#pollOption1", "Option 1"); // Replace with actual selector
        await page.fill("#pollOption2", "Option 2"); // Replace with actual selector
        await page.click("#savePollButton"); // Replace with actual selector

        // Verify the poll is displayed on the polls page
        const newPoll = page.locator("text=New Poll Title"); // Replace with actual selector
        expect(await newPoll.isVisible()).toBeTruthy();
    });

    // Scenario: Vote on a poll
    test("User can vote on a poll", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the polls page
        await page.goto(`${baseUrl}/polls`);

        // Vote on a poll (select an option and submit the vote)
        await page.click("text=New Poll Title"); // Replace with actual selector
        await page.click("#pollOption1"); // Replace with actual selector
        await page.click("#submitVoteButton"); // Replace with actual selector

        // Verify the vote is counted and results are updated
        const pollResults = await page.textContent(".poll-results"); // Replace with actual selector
        expect(pollResults).toContain("Option 1");
    });
});
