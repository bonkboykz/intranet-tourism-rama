import {expect} from "@playwright/test";

export async function loginAs(page, role) {
    const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

    const credentials = {
        user: { username: "test@mail.com", password: "123456" },
        superadmin: { username: "superadmin123", password: "superadminpassword" },
        communityAdmin: { username: "communityAdmin123", password: "adminpassword" },
        departmentAdmin: { username: "departmentAdmin123", password: "adminpassword" },
        member: { username: "member123", password: "memberpassword" },
    };

    const userCredentials = credentials[role];
    if (!userCredentials) {
        throw new Error(`Role “${role}” is not found in the credentials list.`);
    }

    const { username, password } = userCredentials;

    try {
        await page.goto(`${baseUrl}/login`);

        const emailInput = page.locator("input[name='email']");
        const passwordInput = page.locator("input[name='password']");

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();

        await emailInput.fill("test@mail.com");
        await passwordInput.fill("123456");

        const submitButton = page.locator("text=Log in");

        await submitButton.click();

        await page.waitForURL(`${baseUrl}/dashboard`);
    } catch (error) {
        throw new Error(`Error logging in for a role "${role}": ${error.message}`);
    }
}


// Helper to simulate invite to community or department
export async function inviteUserToCommunityOrDepartment(
    page,
    role,
    targetUser,
    type,
    entityName
) {
    const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

    // Log in as an admin or superadmin
    await loginAs(page, role);

    // Navigate to the invite page (modify based on your actual URL)
    if (type === "community") {
        await page.goto(`${baseUrl}/community/${entityName}/invite`);
    } else if (type === "department") {
        await page.goto(`${baseUrl}/departments/${entityName}/invite`);
    }

    // Invite the target user (assuming a simple invite form)
    await page.fill("#inviteUsername", targetUser);
    await page.click("#sendInvite");
}
