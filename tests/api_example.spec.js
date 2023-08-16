import {test, expect} from '@playwright/test';
import { trace } from 'console';

// Validating API responses from website endpoints
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

test.describe('API : Authorized', ()=>{
    test.describe('@smoke- Basic Authorized api Test ', ()=>
    {
        const USERNAME = "test_username01";
        const PASSWORD = "Password01*";
        test('test01_valid_creds', async({request}) =>{
            test.info().annotations.push({
                type: 'task',
                description: 'Verify that we get 200OK as response with valid account credentials',
            });
            
            //await page.goto('https://demoqa.com/login');
            const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
                data: {
                    "userName": USERNAME, 
                    "password": PASSWORD,
                }
            })
            console.log('\n Response = ', await response.json())
            console.log('\n Response Status. Expected=200, Received = ', await response.status())
            await expect(response.ok()).toBeTruthy()
            await expect(response.status()).toBe(200)
        });

        test.skip("test02_Read_response", async ({ page }) => {
            test.info().annotations.push({
                type: 'task',
                description: 'Verify the body of response and print it in log',
            });
            await page.goto("https://demoqa.com/login");
            const [response] = await Promise.all([
                page.waitForResponse(res =>
                    res.status() == 200
                    &&
                    res.body().then(b => {
                        console.log(b);
                        return b.includes("true")
                    })
                ),
                await page.getByPlaceholder('UserName').fill(USERNAME),
                await page.getByPlaceholder('Password').fill(PASSWORD),
                await page.getByRole('button', { name: 'Login' }).click()
            ])
            console.log(await response);
        })  
    })

    test.describe('@negative-Testing available api ', ()=>
    {
        const USERNAME = "test_username01";
        const PASSWORD = "Password01*";
        test('test03_verify_404', async({request}) =>{
            test.info().annotations.push({
                type: 'task',
                description: 'Verify that we get 404 as response with valid account credentials',
            });
            
            //await page.goto('https://demoqa.com/login');
            const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
                data: {
                    "userName": USERNAME, 
                    "password": "PASSWORD",
                }
            })
            console.log('\n Response = ', await response.json())
            console.log('\n Response Status. Expected=404, Received = ', await response.status())
            await expect(response.ok()).toBeFalsy()
            await expect(response.status()).toBe(404)
        });
    
        test('test04_verify_400', async({request}) =>{
            test.info().annotations.push({
                type: 'task',
                description: 'Verify that we get 400 as response with incomplete params',
            });
            
            //await page.goto('https://demoqa.com/login');
            const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
                data: {
                    "userName": USERNAME, 
                    //"password": "PASSWORD",
                }
            })
            console.log('\n Response = ', await response.json())
            console.log('\n Response Status. Expected=400, Received =  ', await response.status())
            await expect(response.ok()).toBeFalsy()
            await expect(response.status()).toBe(400)
        });

        // Please Note, this test should ideally be failing with 400 but we get 200 response. BUG!
        test.skip('test05_400_with_one_more_params', async({request}) =>{
            
            test.info().annotations.push({
                type: 'task',
                description: 'Verify that we get 400 as response with one additional params ',
            });
            
            //await page.goto('https://demoqa.com/login');
            const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
                data: {
                    "userName": USERNAME, 
                    "password": PASSWORD,
                    "extra": "extra"
                }
            })
            console.log('\n Response = ', await response.json())
            console.log('\n Response Status. Expected=200, Received =  ', await response.status())
            //test.fail(await expect(response.ok()).toBeTruthy())
            //test.fail(await expect(response.status()).toBe(200))
            await expect(response.ok()).toBeFalsy()
            await expect(response.status()).toBe(400)
        });
    })
})

