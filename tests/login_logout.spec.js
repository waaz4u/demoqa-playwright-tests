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
        // Verify Username text box has default class value.
        const textBoxName = await page.getByPlaceholder('UserName').getAttribute("class");
        console.log('TextBox name = ', textBoxName)
        await expect(textBoxName).toContain('mr-sm-2 form-control')
        // Verify password textbox has default class value.
        const passBoxName = await page.getByPlaceholder('Password').getAttribute("class");
        console.log('TextBox name = ', passBoxName)
        await expect(passBoxName).toContain('mr-sm-2 form-control')
        
        await page.getByRole('button', { name: 'Login' }).click();
        // verify if the username and password textbox changes to error class.
        const textBoxNewName = await page.getByPlaceholder('UserName').getAttribute("class");
        console.log('TextBox New name = ', textBoxNewName)
        await expect(textBoxNewName).toContain('mr-sm-2 is-invalid form-control')
        
        const passBoxNewName = await page.getByPlaceholder('UserName').getAttribute("class");
        console.log('Password TextBox New name = ', passBoxNewName)
        await expect(passBoxNewName).toContain('mr-sm-2 is-invalid form-control')
        await page.close();
    });
});
  
test.describe('@security - Testing login', ()=>{
    test('test05_malicious_credentials', async ({ page }) => {
      test.info().annotations.push({
          type: 'task',
          description: 'Try to login with malicious username field. This test should actually fail but the site allows malicious content which can be prone to XSS attack',
      });

        await page.goto('https://demoqa.com/login');
        await page.getByPlaceholder('UserName').click();
        await page.getByPlaceholder('UserName').fill('<script>someMaliciousCode()</script>');
        await page.getByPlaceholder('Password').click();
        await page.getByPlaceholder('Password').fill('Password01*');
        await page.getByRole('button', { name: 'Login' }).click();
        // Check text Login Failure message appears on the page.    
        const element = await page.getByText('Invalid username or password!');
        await expect(element !== undefined ).toBeTruthy();

      await page.close();
  });
    
});
