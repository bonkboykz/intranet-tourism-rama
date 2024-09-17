// Helper function to login based on role
export async function loginAs(page, role) {
    const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

    const credentials = {
        user: { username: "user123", password: "userpassword" },
        superadmin: {
            username: "superadmin123",
            password: "superadminpassword",
        },
        communityAdmin: {
            username: "communityAdmin123",
            password: "adminpassword",
        },
        departmentAdmin: {
            username: "departmentAdmin123",
            password: "adminpassword",
        },
        member: { username: "member123", password: "memberpassword" },
    };

    const { username, password } = credentials[role];
    await page.goto(`${baseUrl}/login`);
    await page.fill("#username", username);
    await page.fill("#password", password);
    await page.click("button[type=submit]");
    await page.waitForURL(`${baseUrl}/dashboard`);
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
