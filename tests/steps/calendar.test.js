import { expect, test } from "@playwright/test";

import { loginAs } from "../helpers/loginHelper";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Calendar of Events", () => {
    // Scenario: View Calendar of Events
    test("User can view calendar of events", async ({ page }) => {
        // Log in as a regular user
        await loginAs(page, "user");

        // Navigate to the calendar page
        await page.goto(`${baseUrl}/calendar`);

        // Check if upcoming events are visible
        const events = page.locator(".event-item"); // Replace with actual selector
        const count = await events.count();
        expect(count).toBeGreaterThan(0);
    });

    // Scenario: Add New Event to Calendar
    test("Admin can add a new event to the calendar", async ({ page }) => {
        // Log in as a department admin
        await loginAs(page, "departmentAdmin");

        // Navigate to the calendar page
        await page.goto(`${baseUrl}/calendar`);

        // Add a new event (assuming a form for adding events)
        await page.click("#addEventButton"); // Replace with actual selector
        await page.fill("#eventTitle", "New Event Title");
        await page.fill("#eventDate", "2024-10-01"); // Date input field
        await page.fill("#eventDescription", "Description of the new event");
        await page.click("#saveEventButton"); // Save the event

        // Verify that the event appears in the calendar
        const newEvent = page.locator("text=New Event Title"); // Replace with actual selector
        expect(await newEvent.isVisible()).toBeTruthy();
    });
});
