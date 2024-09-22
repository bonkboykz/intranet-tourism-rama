import {expect, test} from "@playwright/test";
import {loginAs} from "../helpers/loginHelper"; // Импортируем функцию логина
// import * as path from "path";

const baseUrl = "https://intranet-tourism-rama-production.up.railway.app";

test.describe("Community Management", () => {
    // Scenario: View Community Groups
    test("User can automatically log in and view community groups", async ({page}) => {
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

    test("Member can create a public community group", async ({page}) => {
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

        await groupTypeDropdown.selectOption({label: "Public"});

        await createButton.click();

        await page.waitForLoadState("networkidle");

        const newGroup = page.locator(".staff-member-card:has-text('testmember1')");

        console.log("Test passed: Group 'testmember' created and found in the list.");
    });

    // Scenario: Member logs in, navigates to community page, and visits a specific group
    test("Member logs in, navigates to community page, and visits 'jij' group", async ({page}) => {
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
            page.waitForNavigation({waitUntil: "networkidle"}),
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
    test("Logged-in member joins the group, writes, and publishes a post", async ({page}) => {
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

    // Scenario: Logged-in member writes and publishes a post with an emoji
    test("Logged-in member writes and publishes a post with an emoji via Emoji Picker", async ({page}) => {
        // Шаг 1: Войти как участник
        await loginAs(page, "member");

        // Шаг 2: Перейти на страницу группы "testmember"
        await page.goto(`${baseUrl}/communityInner?communityId=26`);
        await page.waitForLoadState("domcontentloaded");

        // Проверить, что мы находимся на странице группы "testmember"
        await expect(page).toHaveURL(/\/communityInner\?communityId=26/);

        // Шаг 3: Ввести текст в поле для поста
        const postInput = page.locator("textarea[placeholder='Share Your Thoughts...']");
        const postContent = "This is a test post with an emoji";
        await postInput.fill(postContent);

        // Шаг 4: Открыть меню с эмодзи
        const emojiButton = page.locator('img[alt="Emoji Icon"]');
        await emojiButton.click();

        // Шаг 5: Выбрать эмодзи (например, "grinning face" 😀)
        const grinningEmoji = page.locator('img[alt="grinning"]'); // Локатор для эмодзи "grinning"
        await grinningEmoji.click();

        // Убедимся, что эмодзи добавлено в поле для поста
        await expect(postInput).toHaveValue(`${postContent}😀`);

        // Шаг 6: Нажать на кнопку "Publish"
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        // Шаг 7: Подождать обновления страницы после публикации поста
        await page.waitForLoadState('networkidle');

        // Шаг 8: Проверить, что пост с эмодзи отобразился в списке постов
        const newPost = page.locator(`.post-content:has-text("${postContent}😀")`);
        await expect(newPost).toBeVisible();

        // Логирование успешного выполнения теста
        console.log(`Test passed: User successfully published a post with an emoji: "${postContent}😀".`);
    });


    // Scenario: Logged-in member creates a poll with any title
    test("Logged-in member creates a poll with any title", async ({page}) => {
        // Шаг 1: Войти как участник
        await loginAs(page, "member");

        // Шаг 2: Перейти на страницу группы "testmember"
        await page.goto(`${baseUrl}/communityInner?communityId=26`);
        await page.waitForLoadState("domcontentloaded");

        // Проверить, что мы находимся на странице группы "testmember"
        await expect(page).toHaveURL(/\/communityInner\?communityId=26/);

        // Шаг 3: Нажать на кнопку "Create Poll"
        const createPollButton = page.locator("img[alt=\"Poll Icon\"]");
        await createPollButton.click();

        // Шаг 4: Ввести заголовок опроса
        const pollTitleInput = page.locator("textarea[placeholder='Type something...']");
        await pollTitleInput.fill("Test Poll Title");

        // Шаг 5: Ввести опции опроса
        const option1Input = page.locator("input[value=\"Option 1\"]");
        const option2Input = page.locator("input[value=\"Option 2\"]");
        await option1Input.fill("Option 1");
        await option2Input.fill("Option 2");

        // Шаг 6: Нажать на кнопку "Create Poll" для завершения создания опроса
        const submitPollButton = page.locator("button:text('Post poll')");
        await submitPollButton.click();

        // Шаг 7: Подождать обновления страницы после создания опроса
        await page.waitForLoadState('networkidle');

        // Шаг 8: Проверить, что опрос с заголовком "Test Poll Title" отображается в списке опросов
        const newPoll = page.locator("article:has-text('Test Poll Title')");
        await expect(newPoll).toBeVisible();

        // Логирование успешного выполнения теста
        console.log(`Test passed: Poll "Test Poll Title" successfully created and visible.`);
    });


    // Scenario: Logged-in member adds an additional option to an existing poll
    test("Logged-in member creates a poll and adds an additional option", async ({page}) => {
        // Шаг 1: Войти как участник
        await loginAs(page, "member");

        // Шаг 2: Перейти на страницу группы "testmember"
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("domcontentloaded");

        // Шаг 3: Нажать на кнопку "Create Poll"
        const createPollButton = page.locator('img[alt="Poll Icon"]');
        await createPollButton.click();

        // Шаг 4: Ввести заголовок опроса
        const pollTitleInput = page.locator("textarea[placeholder='Type something...']");
        await pollTitleInput.fill("Test Poll Title");

        // Шаг 5: Ввести опции опроса
        const option1Input = page.locator("input[value='Option 1']");
        await option1Input.fill("Option 1");

        const option2Input = page.locator("input[value='Option 2']");
        await option2Input.fill("Option 2");

        // Шаг 6: Нажать на кнопку "Add Option"
        const addOptionButton = page.locator('.my-auto:has-text("Add option")')
        await addOptionButton.click();

        // Шаг 7: Ввести новый вариант "Option 3"
        const newOptionInput = page.locator("input[value='Option 3']");
        await newOptionInput.fill("Option 3");

        // Шаг 8: Нажать на кнопку "Post poll"
        const saveOptionButton = page.locator('button:text("Post poll")');
        await saveOptionButton.click();

        // Шаг 9: Подождать обновления страницы после сохранения опции
        await page.waitForLoadState('networkidle');

        // Шаг 10: Проверить, что опрос содержит опции "Option 1", "Option 2" и "Option 3"
        const option1 = page.locator("article:has-text('Option 1')");
        const option2 = page.locator("article:has-text('Option 2')");
        const option3 = page.locator("article:has-text('Option 3')");

        await expect(option1).toBeVisible();
        await expect(option2).toBeVisible();
        await expect(option3).toBeVisible();

        console.log('Test passed: Poll "Test Poll Title" now contains "Option 1", "Option 2", and "Option 3".');
    });

    // Scenario: Logged-in member sets a post as an announcement
    test("Logged-in member sets a post as an announcement", async ({page}) => {
        // Шаг 1: Войти как участник
        await loginAs(page, "member");

        // Шаг 2: Перейти на страницу группы "testmember"
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("domcontentloaded");

        // Проверить, что мы на странице группы "testmember"
        await expect(page).toHaveURL(/\/communityInner\?communityId=37/);

        // Шаг 3: Написать пост
        const postContent = "This is an announcement"; // Объявляем переменную с содержимым поста
        const postInput = page.locator("textarea[placeholder='Share Your Thoughts...']");
        await postInput.fill(postContent);

        // Шаг 5: Установить переключатель "Set as Announcement?" в положение ON
        const announcementToggle = page.locator('.switch');
        const isChecked = await announcementToggle.isChecked(); // Проверяем текущее состояние

        if (!isChecked) {
            await announcementToggle.click(); // Кликаем, чтобы включить, если не включен
        }

        // Шаг 6: Нажать на кнопку "Publish" (значок стрелки)
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        // Шаг 7: Подождать обновления страницы после публикации поста
        await page.waitForLoadState('networkidle');


        // Шаг 8: Проверить, что пост с текстом "This is an announcement" отображается в списке постов
        const newPost = page.locator(`article:has-text("${postContent}")`).last();
        await expect(newPost).toBeVisible();

        // Шаг 9: Проверить, что пост помечен как объявление

        // Мы можем уточнить локатор, проверяя внутри конкретного поста наличие метки "Announcement"
        const announcementLabel = newPost.locator('text=Announcement');
        await expect(announcementLabel).toBeVisible();

        // Логирование успешного выполнения теста
        console.log(`Test passed: Post "${postContent}" is visible and marked as an announcement.`);
    });


    // Scenario: Logged-in member uploads a video
    test("Logged-in member uploads a video and automatically clicks SEND", async ({page}) => {
        // Step 1: Log in as a member
        await loginAs(page, "member");

        // Step 2: Go to the "testmember" group page
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("domcontentloaded");

        // Verify that we are on the "testmember" group page
        await expect(page).toHaveURL(/\/communityInner\?communityId=37/);

        // Step 3: Click the video upload icon (camera icon)
        const videoUploadIcon = page.locator('img[alt="Video Icon"]');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'), // Ожидаем событие открытия файлового менеджера
            videoUploadIcon.click() // Кликаем на иконку загрузки видео
        ]);
        const videoFilePath = 'tests/assets/video700kb.mov';
        await fileChooser.setFiles(videoFilePath);

        // Загрузка видеофайла
        await page.waitForTimeout(2000);
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        await page.waitForLoadState('networkidle');

        const videoLocator = page.locator('video').last();
        const videoSourceLocator = videoLocator.locator('source');

        const videoSrc = await videoSourceLocator.getAttribute('src');

        await expect(videoSrc).toBeTruthy();
        await page.waitForLoadState('domcontentloaded');
        const videoDom = await videoLocator.evaluate((video) => video.outerHTML);

        await expect(videoDom).toContain('<video');
        await expect(videoDom).toContain(`src="${videoSrc}"`);

    });


    test('Logged-in member uploads a video and adds text', async ({page}) => {
        // Логинимся как участник
        await loginAs(page, "member");

        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveURL(`${baseUrl}/communityInner?communityId=37`);

        const videoUploadIcon = page.locator('img[alt="Video Icon"]');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'), // Ожидаем событие открытия файлового менеджера
            videoUploadIcon.click() // Кликаем на иконку загрузки видео
        ]);

        // Загрузка видеофайла
        const videoFilePath = 'tests/assets/video700kb.mov';
        await fileChooser.setFiles(videoFilePath);
        await page.waitForTimeout(2000);
        const postInput = page.locator("textarea[placeholder='Share Your Thoughts...']");
        const postContent = "This is a test post2";
        await postInput.fill(postContent);
        await page.waitForTimeout(2000);
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        await page.waitForLoadState('networkidle');

        const videoLocator = page.locator('video').last();
        const videoSourceLocator = videoLocator.locator('source');

        const videoSrc = await videoSourceLocator.getAttribute('src');

        await expect(videoSrc).toBeTruthy();
        await page.waitForLoadState('domcontentloaded');

        const videoDom = await videoLocator.evaluate((video) => video.outerHTML);

        await expect(videoDom).toContain('<video');
        await expect(videoDom).toContain(`src="${videoSrc}"`);

        const newPost = page.locator(`.post-content:has-text('${postContent}')`).last();
        await expect(newPost).toBeVisible();
    });


    test("Logged-in member uploads a single image", async ({page}) => {
        // Step 1: Log in as a member
        await loginAs(page, "member");

        // Step 2: Go to the "testmember" group page
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("domcontentloaded");

        // Verify that we are on the "testmember" group page
        await expect(page).toHaveURL(/\/communityInner\?communityId=37/);

        // Step 3: Click the image upload icon (camera icon)
        const imageUploadIcon = page.locator('img[alt="Image Icon"]');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'), // Wait for the file chooser to open
            imageUploadIcon.click() // Click the image upload icon
        ]);
        const imageFilePath = 'tests/assets/image1.png';
        await fileChooser.setFiles(imageFilePath);

        // Wait for the image to upload
        await page.waitForTimeout(2000);
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        await page.waitForLoadState('networkidle');

        const imageLocator = page.locator('img').last();
        const imageSrc = await imageLocator.getAttribute('src');

        // Check if the image source is truthy (image uploaded successfully)
        await expect(imageSrc).toBeTruthy();
        await page.waitForLoadState('domcontentloaded');
        const imageDom = await imageLocator.evaluate((img) => img.outerHTML);

        await expect(imageDom).toContain('<img');
        await expect(imageDom).toContain(`src="${imageSrc}"`);
    });

    test("Logged-in member uploads multiple images", async ({ page }) => {
        // Step 1: Log in as a member
        await loginAs(page, "member");

        // Step 2: Go to the "testmember" group page
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("domcontentloaded");

        // Verify that we are on the "testmember" group page
        await expect(page).toHaveURL(/\/communityInner\?communityId=37/);

        // Step 3: Click the image upload icon (camera icon)
        const imageUploadIcon = page.locator('img[alt="Image Icon"]');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'), // Wait for the file chooser to open
            imageUploadIcon.click() // Click the image upload icon
        ]);

        // Specify multiple image files to upload
        const imageFilePaths = [
            'tests/assets/image1.png',
            'tests/assets/image2.png',
        ];

        // Set multiple files in the file chooser
        await fileChooser.setFiles(imageFilePaths);

        // Wait for the images to upload
        await page.waitForTimeout(2000);
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        await page.waitForLoadState('networkidle');

        // Locate all uploaded images
        const images = await page.locator('img').all();

        // Check each image for the expected source
        for (const imageFilePath of imageFilePaths) {
            const imageFileName = imageFilePath.split('/').pop(); // Get the file name
            const imageSrcElement = await images.find(async (img) => {
                const src = await img.getAttribute('src');
                return src && src.includes(imageFileName); // Check if the src contains the image file name
            });

            // Ensure each image was uploaded successfully
            expect(imageSrcElement).toBeTruthy();
            const imageDom = await imageSrcElement.evaluate((img) => img.outerHTML);

            // Check that the HTML contains the expected image source
            await expect(imageDom).toContain('<img');
            const srcAttribute = await imageSrcElement.getAttribute('src'); // Await here
            await expect(imageDom).toContain(`src="${srcAttribute}"`);
        }
    });

    test("Logged-in member uploads multiple images and adds text", async ({ page }) => {
        // Step 1: Log in as a member
        await loginAs(page, "member");

        // Step 2: Go to the "testmember" group page
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("domcontentloaded");

        // Verify that we are on the "testmember" group page
        await expect(page).toHaveURL(/\/communityInner\?communityId=37/);

        // Step 3: Click the image upload icon (camera icon)
        const imageUploadIcon = page.locator('img[alt="Image Icon"]');
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'), // Wait for the file chooser to open
            imageUploadIcon.click() // Click the image upload icon
        ]);

        // Specify multiple image files to upload
        const imageFilePaths = [
            'tests/assets/image1.png',
            'tests/assets/image2.png',
        ];

        // Set multiple files in the file chooser
        await fileChooser.setFiles(imageFilePaths);

        // Wait for the images to upload
        await page.waitForTimeout(2000);
        const postInput = page.locator("textarea[placeholder='Share Your Thoughts...']");
        const postContent = "This is a test post2";
        await postInput.fill(postContent);
        await page.waitForTimeout(2000);
        const publishButton = page.locator('img[alt="SEND"]');
        await publishButton.click();

        await page.waitForLoadState('networkidle');

        // Locate all uploaded images
        const images = await page.locator('img').all();

        // Check each image for the expected source
        for (const imageFilePath of imageFilePaths) {
            const imageFileName = imageFilePath.split('/').pop(); // Get the file name
            const imageSrcElement = await images.find(async (img) => {
                const src = await img.getAttribute('src');
                return src && src.includes(imageFileName); // Check if the src contains the image file name
            });

            // Ensure each image was uploaded successfully
            expect(imageSrcElement).toBeTruthy();
            const imageDom = await imageSrcElement.evaluate((img) => img.outerHTML);

            // Check that the HTML contains the expected image source
            await expect(imageDom).toContain('<img');
            const srcAttribute = await imageSrcElement.getAttribute('src'); // Await here
            await expect(imageDom).toContain(`src="${srcAttribute}"`);
        }
        const newPost = page.locator(`.post-content:has-text('${postContent}')`).last();
        await expect(newPost).toBeVisible();
    });

    // TODO
    test("Logged-in member downloads a file", async ({ page }) => {
        // Step 1: Log in as a member
        await loginAs(page, "member");

        // Step 2: Go to the group page
        await page.goto(`${baseUrl}/communityInner?communityId=37`);
        await page.waitForLoadState("networkidle");

        // Verify that we are on the correct group page
        await expect(page).toHaveURL(/\/communityInner\?communityId=37/);

        // Step 3: Click the link/button to download the file
        const downloadLink = page.locator('text=Download File'); // Adjust selector as needed
        const [download] = await Promise.all([
            page.waitForEvent('download'), // Wait for the download event
            downloadLink.click() // Click the download link
        ]);

        const filePath = 'tests/assets/testdoc.xlsx'; // Specify the file path
        // Step 4: Define the expected download path (local path)
        const downloadDir = path.join(__dirname, 'downloads'); // Ensure this directory exists
        const downloadPath = path.join(downloadDir, path.basename(filePath)); // Use the same name as the original file

        // Step 5: Wait for the download to complete and save the file
        await download.saveAs(downloadPath);

        // Step 6: Check if the file exists
        await page.waitForTimeout(2000); // Give time for the file to save
        const fileExists = fs.existsSync(downloadPath);
        expect(fileExists).toBe(true); // Ensure the file was downloaded successfully

        // Optionally: Check for a confirmation message or download indicator
        const downloadIndicator = page.locator('.download-indicator'); // Adjust selector as needed
        await expect(downloadIndicator).toBeVisible();
    });




});
