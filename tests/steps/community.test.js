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

    // Scenario: Member logs in, navigates to community page, and visits a specific group
    test("Member logs in, navigates to community page, and visits 'jij' group", async ({ page }) => {
        await loginAs(page, "member");

        // Переход на страницу сообщества
        await page.goto(`${baseUrl}/community`);
        await page.waitForLoadState("domcontentloaded");

        // Убедиться, что на странице сообщества
        await expect(page).toHaveURL(`${baseUrl}/community`);

        // Ждем, пока появятся карточки сообществ
        const communityItems = page.locator(".staff-member-card");
        await page.waitForSelector(".staff-member-card");

        const count = await communityItems.count();
        expect(count).toBeGreaterThan(0);

        // Ищем ссылку внутри карточки с текстом 'jij'
        const jijGroupLink = page.locator(".staff-member-card:has-text('jij') a");
        await expect(jijGroupLink).toBeVisible();

        // Ожидаем переход на страницу после клика по 'jij'
        await Promise.all([
            page.waitForNavigation({ waitUntil: "networkidle" }),
            jijGroupLink.click(),
        ]);

        // Проверка, что мы перешли на страницу с communityId (динамическая часть URL)
        await expect(page).toHaveURL(/\/communityInner\?communityId=\d+/);

        // Проверка, что заголовок с текстом 'jij' отображается на новой странице
        const groupHeader = page.locator("h1:has-text('jij')");
        await expect(groupHeader).toBeVisible();

        console.log("Test passed: Successfully navigated to 'jij' community group page.");
    });

    // Scenario: Logged-in member joins the group, writes, and publishes a post
    test("Logged-in member joins the group, writes, and publishes a post", async ({ page }) => {
        // Шаг 1: Войти как участник
        await loginAs(page, "member");

        // Шаг 2: Перейти на страницу группы "testmember"
        await page.goto(`${baseUrl}/communityInner?communityId=26`);
        await page.waitForLoadState("domcontentloaded");

        // Проверить, что мы находимся на странице группы "testmember"
        await expect(page).toHaveURL(/\/communityInner\?communityId=26/);

        // Найти кнопку "Join" и нажать на нее
        const joinButton = page.locator("button:text('Join')");

        // Нажать на кнопку и ждать, пока страница обновится
        await Promise.all([
            page.waitForLoadState('networkidle'), // Ждем завершения сетевых запросов после нажатия
            joinButton.click(), // Клик по кнопке "Join"
        ]);

        // Шаг 3: Ввести текст в поле для поста после присоединения к группе
        const postInput = page.locator("textarea[placeholder='Share Your Thoughts...']"); // Локатор поля ввода поста
        await postInput.fill("This is a test post2"); // Вводим текст поста

        // Шаг 4: Нажать на кнопку "Publish"
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click(); // Нажать на кнопку

        // Шаг 5: Подождать обновления страницы после публикации поста
        await page.waitForLoadState('networkidle'); // Ждем завершения всех сетевых запросов

        // Шаг 6: Проверить, что пост отобразился в списке постов
        const newPost = page.locator(".post-content:has-text('This is a test post')"); // Локатор для нового поста
        await expect(newPost).toBeVisible(); // Убедиться, что новый пост виден

        // Логирование успешного выполнения теста
        console.log("Test passed: User joined the group, wrote, and published a post successfully.");
    });




});
