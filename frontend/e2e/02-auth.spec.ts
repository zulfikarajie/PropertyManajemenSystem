import { test, expect } from '@playwright/test';
import { attachErrorCollectors, ADMIN, INACTIVE, login } from './helpers';

test.describe('SCN-02 Authentication', () => {
  test('SCN-02-01 login page renders', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/login');
    await expect(page.getByText(/welcome back/i)).toBeVisible();
    await expect(page.getByPlaceholder('john@hotel.com')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Login$/ })).toBeVisible();
  });

  test('SCN-02-02 invalid credentials stay on login with alert', async ({ page }) => {
    attachErrorCollectors(page);
    await login(page, 'wrong@hotel.com', 'wrongpass');
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('SCN-02-03 inactive user cannot login', async ({ page }) => {
    attachErrorCollectors(page);
    await login(page, INACTIVE.email, INACTIVE.password);
    await page.waitForTimeout(1500);
    expect(page.url()).toContain('/login');
    const token = await page.evaluate(() => localStorage.getItem('pms_token'));
    expect(token).toBeNull();
  });

  test('SCN-02-04 admin login success sets token', async ({ page }) => {
    attachErrorCollectors(page);
    await login(page, ADMIN.email, ADMIN.password);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    const token = await page.evaluate(() => localStorage.getItem('pms_token'));
    expect(token).toBeTruthy();
    await expect(page.getByText(/joglo seruni/i).first()).toBeVisible();
  });

  test('SCN-02-05 public-only guard redirects authed /login to dashboard', async ({ page }) => {
    attachErrorCollectors(page);
    await login(page, ADMIN.email, ADMIN.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/login');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('SCN-02-06 protected guard redirects unauth to login', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/');
    await page.evaluate(() => { localStorage.removeItem('pms_token'); localStorage.removeItem('pms_user'); });
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('SCN-02-07 register success lands on /login, duplicate stays with error [FIXED]', async ({ page }) => {
    attachErrorCollectors(page);
    const stamp = Date.now();
    const email = `e2e${stamp}@hotel.com`;
    // NOTE: all steps below are SPA navigations (no page.goto reloads — the mock
    // user store is in-memory, so a full reload would wipe the new account).
    await page.goto('/register');
    await expect(page.getByText(/create account/i)).toBeVisible();
    await page.getByPlaceholder('John Doe').fill(`E2E User ${stamp}`);
    await page.getByPlaceholder('john@hotel.com').fill(email);
    await page.getByPlaceholder('Min 6 characters').first().fill('password123');
    await page.getByPlaceholder('Confirm password').fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    // FIXED: no auto-login anymore — lands on /login as unauthenticated user.
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    expect(await page.evaluate(() => localStorage.getItem('pms_token'))).toBeNull();

    // Duplicate email: back via SPA "Sign Up" button, stays on /register with error.
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
    await page.getByPlaceholder('John Doe').fill('Dup');
    await page.getByPlaceholder('john@hotel.com').fill(email);
    await page.getByPlaceholder('Min 6 characters').first().fill('password123');
    await page.getByPlaceholder('Confirm password').fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/register/, { timeout: 10000 });
    await expect(page.getByRole('alert')).toContainText(/already registered/i, { timeout: 10000 });

    // New account can actually log in (SPA "Sign in" link, same memory context).
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await page.getByPlaceholder('john@hotel.com').fill(email);
    await page.getByPlaceholder('Enter your password').fill('password123');
    await page.getByRole('button', { name: /^Login$/ }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test('SCN-02-08/09 forgot password resets for real, generic message for unknown [FIXED]', async ({ page }) => {
    attachErrorCollectors(page);
    // Known email: generic status, then set a new password, then log in with it.
    await page.goto('/forgot-password');
    await page.getByPlaceholder('john@hotel.com').fill(ADMIN.email);
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.getByRole('status')).toContainText(/if an account.*exists/i, { timeout: 10000 });
    await page.getByPlaceholder('Min 6 characters').fill('newpass456');
    await page.getByPlaceholder('Confirm password').fill('newpass456');
    await page.getByRole('button', { name: /reset password/i }).click();
    await expect(page.getByRole('status')).toContainText(/successfully/i, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    // Persistence proof: login works with the NEW password (same page context).
    await page.getByPlaceholder('john@hotel.com').fill(ADMIN.email);
    await page.getByPlaceholder('Enter your password').fill('newpass456');
    await page.getByRole('button', { name: /^Login$/ }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

    // Unknown email: identical generic message (no enumeration oracle).
    await page.evaluate(() => { localStorage.removeItem('pms_token'); localStorage.removeItem('pms_user'); });
    await page.goto('/forgot-password');
    await page.getByPlaceholder('john@hotel.com').fill('unknown@x.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    await expect(page.getByRole('status')).toContainText(/if an account.*exists/i, { timeout: 10000 });
  });

  test('SCN-02-10 reset password without token shows message', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/reset-password');
    await expect(page.locator('body')).toContainText(/no reset token|token/i);
  });

  test('SCN-02-11 change password form visible (auth)', async ({ page }) => {
    attachErrorCollectors(page);
    await login(page, ADMIN.email, ADMIN.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/change-password');
    await expect(page.getByRole('heading', { name: /change password/i })).toBeVisible({ timeout: 10000 });
  });

  test('SCN-02-12 logout clears session', async ({ page }) => {
    attachErrorCollectors(page);
    await login(page, ADMIN.email, ADMIN.password);
    await expect(page).toHaveURL(/\/dashboard/);
    const btn = page.getByRole('button', { name: /logout/i }).first();
    await expect(btn).toBeVisible({ timeout: 10000 });
    await btn.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem('pms_token'));
    expect(token).toBeNull();
  });
});
