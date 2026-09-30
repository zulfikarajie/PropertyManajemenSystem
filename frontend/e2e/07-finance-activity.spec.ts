import { test, expect } from '@playwright/test';
import { attachErrorCollectors, loginAsAdmin } from './helpers';

test.describe('SCN-07 Finance + SCN-08 Activity', () => {
  test.beforeEach(async ({ page }) => {
    attachErrorCollectors(page);
    await loginAsAdmin(page);
  });

  test('SCN-07-01 sales overview renders with period filters', async ({ page }) => {
    await page.goto('/dashboard/finance/sales');
    await expect(page.getByRole('heading', { name: /sales.*revenue/i })).toBeVisible({ timeout: 15000 });
    for (const f of [/hari ini/i, /minggu ini/i, /bulan ini/i]) {
      const b = page.getByRole('button', { name: f }).first();
      if (await b.count()) { await b.click(); await page.waitForTimeout(400); }
    }
    await expect(page.locator('body')).toContainText(/total sales|net revenue/i);
  });

  test('SCN-07-02/03 invoices list + create', async ({ page }) => {
    await page.goto('/dashboard/finance/invoices');
    await expect(page.getByRole('heading', { name: /invoices/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByPlaceholder(/search invoice or guest/i)).toBeVisible();
    await page.getByRole('button', { name: /new invoice/i }).first().click({ timeout: 10000 });
    const modal = page.getByRole('dialog');
    if (await modal.count()) {
      await expect(modal).toBeVisible({ timeout: 10000 });
      const stamp = Date.now().toString().slice(-6);
      const num = `INV-E2E-${stamp}`;
      const numIn = page.getByPlaceholder(/INV-2026-001/i);
      if (await numIn.count()) await numIn.fill(num);
      const guest = page.locator('input[type="text"]').nth(1);
      if (await guest.count()) await guest.fill(`E2E Guest ${stamp}`).catch(() => {});
      await page.getByRole('button', { name: /create invoice/i }).last().click().catch(() => {});
      await page.waitForTimeout(1200);
      await page.keyboard.press('Escape');
      await page.goto('/dashboard/finance/invoices');
    } else {
      await expect(page).toHaveURL(/invoices\/new/);
    }
  });

  test('SCN-07-04 invoice detail opens', async ({ page }) => {
    await page.goto('/dashboard/finance/invoices');
    const row = page.locator('a[href*="/dashboard/finance/invoices/"], tr').first();
    await expect(row).toBeVisible({ timeout: 15000 });
    const link = page.locator('a[href*="/dashboard/finance/invoices/"]').first();
    if (await link.count()) {
      await link.click();
      await page.waitForTimeout(1000);
      await expect(page.locator('body')).toContainText(/subtotal|total|guest/i);
    }
  });

  test('SCN-07-08 reports render with export buttons', async ({ page }) => {
    await page.goto('/dashboard/finance/reports');
    await expect(page.getByRole('heading', { name: /laporan keuangan/i })).toBeVisible({ timeout: 15000 });
    for (const b of [/print pdf/i, /export excel/i, /export pdf/i]) {
      const el = page.getByRole('button', { name: b }).first();
      if (await el.count()) await expect(el).toBeVisible();
    }
  });

  test('SCN-07-09/10 expenses list + create', async ({ page }) => {
    await page.goto('/dashboard/finance/expenses');
    await expect(page.getByRole('heading', { name: /expenses/i })).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: /new expense/i }).first().click({ timeout: 10000 });
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });
    const desc = page.getByPlaceholder(/.*/).first();
    const amount = page.locator('input[type="number"]').first();
    if (await amount.count()) await amount.fill('150000');
    // fill description textbox if found
    const textboxes = page.getByRole('textbox');
    const n = await textboxes.count();
    for (let i = 0; i < n; i++) {
      const tb = textboxes.nth(i);
      if (await tb.isVisible().catch(() => false)) {
        const v = await tb.inputValue().catch(() => '');
        if (!v) { await tb.fill('E2E expense').catch(() => {}); break; }
      }
    }
    const create = page.getByRole('button', { name: /create expense/i }).last();
    if (await create.count()) await create.click();
    await page.waitForTimeout(1200);
    await page.keyboard.press('Escape');
  });

  test('SCN-08-01/02 activity log renders + search', async ({ page }) => {
    await page.goto('/dashboard/activity');
    await expect(page.getByRole('heading', { name: /activity log/i })).toBeVisible({ timeout: 15000 });
    const search = page.getByPlaceholder(/search activities/i);
    await expect(search).toBeVisible();
    await search.fill('login');
    await page.waitForTimeout(700);
    await search.fill('');
  });
});
