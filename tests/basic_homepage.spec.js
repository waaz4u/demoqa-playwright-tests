// const { test, expect } = require("@playwright/test");
import {test, expect} from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    console.log(`Running ${testInfo.title}`);
})

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus)
        console.log(`Did not run as expected, ended up at ${page.url()}`);
    else    
        try{
            await page.screenshot({ path: 'screenshots/'+testInfo.title+Date.now()+'.png', fullPage: true });
        }
        catch (err) {
            console.log("Failed to get screenshot !!!")
        }
})

test.describe('@smoke -Testing Home page basic elements', ()=>{
    test('test01',async ({page})=>{
        test.info().annotations.push({
            type: 'Task',
            description: 'Verify homepage url',
        });

        // Open the home page to see url works.
        await page.goto('https://demoqa.com/login');
        // Check page url is correct.
        const pageURL = await page.url();
        console.log('Page url is : ', pageURL);
        await expect(page).toHaveURL('https://demoqa.com/login');
        await page.close();
    });

    test('test_02_verify_title',async ({page})=>{
        test.info().annotations.push({
            type: 'Task',
            description: 'Verify page title is "DEMOQA"',
        });

        await page.goto('https://demoqa.com/login');
        // Verify page title is DEMOQA.
        const pagetitle = await page.title();
        console.log('Page Title is : ', pagetitle);
        await expect(page).toHaveTitle('DEMOQA');
        await page.close();
    });

    test('test_03_verify_text_on_page',async ({page})=>{
        test.info().annotations.push({
            type: 'Task',
            description: 'Verify homepage has "Login" text',
        });

        await page.goto('https://demoqa.com/login');
        // Check text Login appears on the page.    
        const element = await page.getByText('Login');
        await expect(element !== undefined ).toBeTruthy();
        await page.close();
    });
    
    test('test_04_validate_url_response', async ({page})=>{
        test.info().annotations.push({
            type: 'Task',
            description: 'Verify homepage response is 2xx or OK',
        });
        const response = await page.request.get('https://demoqa.com/login');
        console.log("Page response for home url = ", response)
        await expect(response).toBeOK();
        await page.close()

    })
});
