import { test, expect } from '@playwright/test';
import { attachErrorCollectors, loginAsAdmin, login, STAFF } from './helpers';

test.describe('SCN-06 Users Roles Permissions', () => {
  test.beforeEach(async ({ page }) => {
    attachErrorCollectors(page);
    await loginAsAdmin(page);
  });

  test('SCN-06-01 users list renders', async ({ page }) => {
    await page.goto('/dashboard/users');
    await expect(page.getByRole('heading', { name: /pengguna/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByPlaceholder(/search by name or email/i)).toBeVisible();
  });

  test('SCN-06-02/03 create user via form page (no reload — mock store is in-memory)', async ({ page }) => {
    const stamp = Date.now();
    const email = `u${stamp}@hotel.com`;
    await page.goto('/dashboard/users/new');
    const nameInput = page.getByPlaceholder('John Doe');
    await expect(nameInput).toBeVisible({ timeout: 15000 });
    await nameInput.fill(`E2E ${stamp}`);
    await page.getByPlaceholder('john@hotel.com').fill(email);
    const pw = page.getByPlaceholder('Min 6 characters');
    if (await pw.count()) await pw.first().fill('password123');
    // select a role (UserForm Role select defaults to '' — pick first real role)
    const roleSelect = page.locator('select').first();
    if (await roleSelect.count()) await roleSelect.selectOption({ index: 1 }).catch(() => {});
    await page.getByRole('button', { name: /create user/i }).click();
    // UserFormPage onSuccess SPA-navigates to /dashboard/users WITHOUT full reload,
    // so the in-memory record survives. Do NOT page.goto (that resets the store).
    await expect(page).toHaveURL(/\/dashboard\/users$/, { timeout: 15000 });
    await expect(page.locator('body')).toContainText(new RegExp(`E2E ${stamp}`), { timeout: 10000 });

    // Duplicate email via the list's "Add User" modal (same page, no reload so the
    // in-memory record survives): modal stays open with inline error (FIXED).
    await page.getByRole('button', { name: /add user/i }).first().click({ timeout: 10000 });
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await modal.getByPlaceholder('John Doe').fill('Dup User');
    await modal.getByPlaceholder('john@hotel.com').fill(email);
    const pwModal = modal.getByPlaceholder('Min 6 characters');
    if (await pwModal.count()) await pwModal.first().fill('password123');
    await modal.getByRole('button', { name: /create user/i }).click();
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal).toContainText(/already registered/i, { timeout: 10000 });
    await page.keyboard.press('Escape');
  });

  test('SCN-06-04 user detail opens', async ({ page }) => {
    await page.goto('/dashboard/users');
    const view = page.getByRole('link', { name: /view/i }).first();
    await expect(view).toBeVisible({ timeout: 15000 });
    await view.click();
    await expect(page).toHaveURL(/\/dashboard\/users\/.+/, { timeout: 10000 });
    await expect(page.locator('body')).toContainText(/user information|name|email/i);
  });

  test('SCN-06-06/07 roles list + create role', async ({ page }) => {
    await page.goto('/dashboard/roles');
    await expect(page.getByRole('heading', { name: /jabatan/i })).toBeVisible({ timeout: 15000 });
    const create = page.getByRole('button', { name: /create role/i }).first();
    await expect(create).toBeVisible();
    await create.click();
    const stamp = Date.now().toString().slice(-5);
    const modal = page.getByRole('dialog');
    if (await modal.count()) {
      await expect(modal).toBeVisible({ timeout: 10000 });
      const nameIn = page.getByPlaceholder(/e\.g\., manager/i).or(page.locator('input[type="text"]').first());
      await nameIn.first().fill(`E2E Role ${stamp}`);
      const cb = page.locator('input[type="checkbox"]').first();
      if (await cb.count()) await cb.check().catch(() => {});
      await page.getByRole('button', { name: /create role/i }).last().click();
      await page.waitForTimeout(1200);
    } else {
      await expect(page).toHaveURL(/\/dashboard\/roles\/new/);
    }
  });

  test('SCN-06-09 permissions list renders', async ({ page }) => {
    await page.goto('/dashboard/permissions');
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/permission|user\.view|reservation/i);
  });

  test('SCN-06-10 staff denied finance + activity shows Akses Ditolak', async ({ page }) => {
    // beforeEach logged in as admin — must clear session first, otherwise
    // /login bounces back to /dashboard via PublicOnlyRoute (previous timeout cause).
    await page.evaluate(() => { localStorage.removeItem('pms_token'); localStorage.removeItem('pms_user'); });
    await login(page, STAFF.email, STAFF.password);
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/dashboard/finance/sales');
    await expect(page.locator('body')).toContainText(/akses ditolak|tidak memiliki izin/i, { timeout: 10000 });
    await page.goto('/dashboard/activity');
    await expect(page.locator('body')).toContainText(/akses ditolak|tidak memiliki izin/i, { timeout: 10000 });
  });
});
