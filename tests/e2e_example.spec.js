import {test, expect} from '@playwright/test';

//############################################
// Page Navigation & E2E test
// 1. webui: test to login into account 
// 2. webui: delete all books for a user.
// 3. webui: add a book from shelf.
// 4. webui: goto profile and check if the book is added.
// 5. api: Now use the api to get the books for the profile to verify if the book added via test is added.
//############################################

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


test.describe('Testing adding book to profile', ()=>{
    test('test01', async ({ page }) => {
        test.info().annotations.push({
            type: 'task',
            description: 'Login and add book to user profile via webUI and check it via webui and api (backend info).',
        });

        // 1. webui: test to login into account 
        await page.goto('https://demoqa.com/login');
        await page.getByPlaceholder('UserName').click();
        await page.getByPlaceholder('UserName').fill('test_username05');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Password01*');
        await page.getByRole('button', { name: 'Login' }).click();

        // check if navigated to new profile page after login.
        var url=await page.url();//get the url of the current page
        await expect(page).toHaveURL('https://demoqa.com/profile')
        
        
        // 2. webui: delete all books for a user.
        await page.getByRole('button', { name: 'Delete All Books' }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        

        // 3. webui: add a book from shelf.
        await page.locator('li').filter({ hasText: /^Book Store$/ }).click();
        await page.getByRole('link', { name: 'Git Pocket Guide' }).click();
        await page.getByRole('button', { name: 'Add To Your Collection' }).click();
        await page.locator('li').filter({ hasText: 'Profile' }).click();
        await page.getByRole('gridcell', { name: 'Richard E. Silverman' }).click();
       

        // 4. webui: goto profile and check if the book is added.

        //const bookTitle = await page.getByRole('link', { name: 'Git Pocket Guide' }).getAttribute('id');
        //const bookTitle = await page.getByRole('link', { name: 'Git Pocket Guide' }).getAttribute()
        //console.log('book title  = ', response)
        //await expect(bookTitle).toContain('see-book-Git Pocket Guide') 
        
        
        // 5. api: Now use the api to get the books for the profile to verify if the book added via test is added.

       
        // Logout and close the page.
        await expect(page).toHaveURL('https://demoqa.com/profile')
        await page.getByRole('button', { name: 'Log out' }).click();
        await page.close();
  });
});