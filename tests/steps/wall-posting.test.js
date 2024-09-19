import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Wall Posting", () => {
    // Scenario: Post on Dashboard Wall
    test("User can post on dashboard wall", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the dashboard
        await page.goto(`${baseUrl}/dashboard`);

        // Post a message on the dashboard wall
        await page.fill("#postMessage", "Hello, this is a dashboard post!"); // Replace with actual selector
        await page.click("#postButton"); // Replace with actual selector

        // Verify the post appears on the wall
        const post = page.locator("text=Hello, this is a dashboard post!"); // Replace with actual selector
        expect(await post.isVisible()).toBeTruthy();
    });

    // Scenario: Post on Profile Wall
    test("User can post on profile wall", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the profile page
        await page.goto(`${baseUrl}/profile`);

        // Post a message on the profile wall
        await page.fill("#postMessage", "This is a post on my profile wall!"); // Replace with actual selector
        await page.click("#postButton"); // Replace with actual selector

        // Verify the post appears on the profile wall
        const post = page.locator("text=This is a post on my profile wall!"); // Replace with actual selector
        expect(await post.isVisible()).toBeTruthy();
    });

    // Scenario: Post on Department Wall
    test("Department member can post on department wall", async ({ page }) => {
        // Log in as a department member
        await loginAs(page, "departmentAdmin");

        // Navigate to the department page
        await page.goto(`${baseUrl}/departments`);

        // Post a message on the department wall
        await page.fill(
            "#postMessage",
            "This is a post on the department wall!"
        ); // Replace with actual selector
        await page.click("#postButton"); // Replace with actual selector

        // Verify the post appears on the department wall
        const post = page.locator(
            "text=This is a post on the department wall!"
        ); // Replace with actual selector
        expect(await post.isVisible()).toBeTruthy();
    });

    // Scenario: Post on Community Wall
    test("Community member can post on community wall", async ({ page }) => {
        // Log in as a community member
        await loginAs(page, "member");

        // Navigate to the community page
        await page.goto(`${baseUrl}/community`);

        // Post a message on the community wall
        await page.fill(
            "#postMessage",
            "This is a post on the community wall!"
        ); // Replace with actual selector
        await page.click("#postButton"); // Replace with actual selector

        // Verify the post appears on the community wall
        const post = page.locator("text=This is a post on the community wall!"); // Replace with actual selector
        expect(await post.isVisible()).toBeTruthy();
    });
});
