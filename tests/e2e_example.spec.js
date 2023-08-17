import {test, expect} from '@playwright/test';
import exp from 'constants';
import { json } from 'stream/consumers';

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

const USERNAME = "test_username05";
const PASSWORD = "Password01*";

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

test.describe.serial('Testing adding book to profile', ()=>{
    test('test01_Add_and_verify_book_via_webui', async ({page}) => {
        test.info().annotations.push({
            type: 'task',
            description: 'Login, delete all books and add a book to user profile via webUI.',
        });
        console.log('page == ', typeof page)
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
        
        
        // 4. webui: goto profile page and check if the book is added.
        await page.goto('https://demoqa.com/profile')
        const bookVisible = await page.getByRole('link', { name: 'Git Pocket Guide' }).isVisible();
        console.log("Book visible = ", bookVisible)
        await expect(bookVisible == true).toBeTruthy()
        
        // 5. api: Now use the api to get the books for the profile to verify if the book added via test is added.
          
        // Logout and close the page.
        await page.goto('https://demoqa.com/profile')
        await page.getByRole('button', { name: 'Log out' }).click();
        await page.close();
    });

    test('test02_Check_users_book_via_api', async ({ request }) => {
        //const USERNAME = "test_username05";
        //const PASSWORD = "Password01*";
        test.info().annotations.push({
            type: 'task',
            description: 'User API to get user profile info and see available books matches the one added via webui',
        });
        // 1. Get Bearer token of the user.
        const getToken = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                "userName": USERNAME, 
                "password": PASSWORD,
            }   
        })
    
        //console.log('\n token = ', await getToken.json())
        let val = await getToken.json();    
        let valtkn = val.token
        console.log('\n -- > Token = ' + valtkn);

        // 2. get userID of the user.
        const getUser = await request.post("https://demoqa.com/Account/v1/Login", {
            'headers': {
                'authorization': 'Bearer ' + valtkn
            },
            data: {
            "userName": USERNAME, 
            "password": PASSWORD,
        }   
        })
        
        console.log('\n userID = ', await getUser.json())
        let valUserIdJson = await getUser.json();    
        let userId = valUserIdJson.userId
        console.log("\n -- > user id = " + userId);

        const newUrl = "https://demoqa.com/Account/v1/User/" + userId
        console.log('\n userdata url is '+newUrl)
        
        // 3. Get the book in the user profile.
        let getUserData = await request.get( newUrl, {
            'headers': {
                'authorization': 'Bearer ' + valtkn
                //'authorization': 'Bearer ' + tkn
            },
            data: {
            "userName": USERNAME, 
            "password": PASSWORD,
            }   
        })
        // console.log('\n -- > userIdData = ', await getUserData.json())
        let userDataJson = await getUserData.json();    
        let userDatabooks = userDataJson.books
        let Title = userDatabooks[0].title
        console.log('Title of book = ', Title)
        // Verify added book via webUI is same received via api.
        await expect(Title == 'Git Pocket Guide').toBeTruthy()
        //await request.close()
    })
});