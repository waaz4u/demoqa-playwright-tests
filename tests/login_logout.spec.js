import {test, expect} from '@playwright/test';

test.describe('@smoke - Testing login', ()=>{
  test('test01_valid_username', async ({ page }) => {
    test.info().annotations.push({
        type: 'task',
        description: 'Verify login works with valid credentials ...',
    });
      
    await page.goto('https://demoqa.com/login');
    await page.getByPlaceholder('UserName').click();
    await page.getByPlaceholder('UserName').fill('test_username01');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Password01*');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.close();
  });
});


test.describe('@negative - Testing login', ()=>{
    test('test02_invalid_credentials',async ({page})=>{
        test.info().annotations.push({
          type: 'task',
          description: 'Test to verify invalid username message appears if username not correct ...',
        });

        await page.goto('https://demoqa.com/login');
        await page.getByPlaceholder('UserName').click();
        await page.getByPlaceholder('UserName').fill('test_username02');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Password01*');
        await page.getByRole('button', { name: 'Login' }).click();
        // Check text Login Failure message appears on the page.    
        const element = await page.getByText('Invalid username or password!');
        await expect(element !== undefined ).toBeTruthy();
        await page.close();
      });

    test('test03_invalid_credentials', async ({ page }) => {
        test.info().annotations.push({
            type: 'task',
            description: 'Verify invalid username message appears if username is correct but password is wrong ...',
        });
        
        await page.goto('https://demoqa.com/login');
        await page.getByPlaceholder('UserName').click();
        await page.getByPlaceholder('UserName').fill('test_username01');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Password02*');
        await page.getByRole('button', { name: 'Login' }).click();
        const element = await page.getByText('Invalid username or password!');
        await expect(element !== undefined ).toBeTruthy();
        //await page.getByRole('button', { name: 'Log out' }).click();
        await page.close();
    });

    test('test04_no_credentials', async ({ page }) => {
        test.info().annotations.push({
            type: 'task',
            description: 'Click login button with empty creds.',
        });

        await page.goto('https://demoqa.com/login');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.close();
    });
});
