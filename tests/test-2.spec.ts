import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await page.locator('div:nth-child(6) > div > .card-up').click();
  await page.locator('li').filter({ hasText: 'Login' }).click();
  await page.getByPlaceholder('UserName').click();
  await page.getByPlaceholder('UserName').fill('test_username01');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('Password01*');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Book Store', { exact: true }).click();
  await page.getByRole('link', { name: 'Designing Evolvable Web APIs with ASP.NET' }).click();
  await page.getByRole('button', { name: 'Add To Your Collection' }).click();
  await page.getByRole('button', { name: 'Back To Book Store' }).click();
  await page.locator('li').filter({ hasText: 'Profile' }).click();
  await page.getByRole('link', { name: 'Designing Evolvable Web APIs with ASP.NET' }).click();
  await page.getByRole('button', { name: 'Log out' }).click();
});