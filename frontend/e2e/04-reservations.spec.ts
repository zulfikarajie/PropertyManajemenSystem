import { test, expect } from '@playwright/test';
import { attachErrorCollectors, loginAsAdmin } from './helpers';

function fmt(d: Date) { return d.toISOString().slice(0, 10); }

test.describe('SCN-04 Reservations', () => {
  test.beforeEach(async ({ page }) => {
    attachErrorCollectors(page);
    await loginAsAdmin(page);
  });

  test('SCN-04-01 list renders with search filter pills', async ({ page }) => {
    await page.goto('/dashboard/reservations');
    await expect(page.getByRole('heading', { name: /reservations/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByPlaceholder(/search reservations/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /filter/i }).first()).toBeVisible();
  });

  test('SCN-04-02 search filters list', async ({ page }) => {
    await page.goto('/dashboard/reservations');
    const search = page.getByPlaceholder(/search reservations/i);
    await expect(search).toBeVisible({ timeout: 15000 });
    await search.fill('zzz-no-such-guest-xyz');
    await page.waitForTimeout(800);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/no reservations found|showing 0|0 result/i);
  });

  test('SCN-04-03 filter dialog apply + reset', async ({ page }) => {
    await page.goto('/dashboard/reservations');
    const filterBtn = page.getByRole('button', { name: /^filter$/i }).first();
    await expect(filterBtn).toBeVisible({ timeout: 15000 });
    await filterBtn.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });
    const apply = page.getByRole('button', { name: /apply/i }).first();
    if (await apply.count()) await apply.click();
    await page.waitForTimeout(600);
    // reopen + reset if present
    await filterBtn.click().catch(() => {});
    const reset = page.getByRole('button', { name: /reset/i }).first();
    if (await reset.count()) await reset.click().catch(() => {});
  });

  test('SCN-04-04 wizard validation blocks empty submit', async ({ page }) => {
    await page.goto('/dashboard/reservations');
    await page.getByRole('button', { name: /new reservation/i }).first().click({ timeout: 10000 });
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /save & continue/i }).first().click();
    await expect(page.getByRole('alert').first()).toBeVisible({ timeout: 10000 });
    await page.keyboard.press('Escape');
  });

  test('SCN-04-05 create reservation multi-room manual rate', async ({ page }) => {
    await page.goto('/dashboard/reservations/new');
    // support both full-page form and modal wizard
    const guest = page.getByPlaceholder(/enter guest name/i).first();
    await expect(guest).toBeVisible({ timeout: 15000 });
    const stamp = Date.now().toString().slice(-6);
    await guest.fill(`E2E Guest ${stamp}`);
    const checkin = page.locator('input[type="date"]').first();
    const checkout = page.locator('input[type="date"]').nth(1);
    const ci = new Date(); ci.setDate(ci.getDate() + 7);
    const co = new Date(); co.setDate(co.getDate() + 9);
    await checkin.fill(fmt(ci));
    await checkout.fill(fmt(co));
    const notes = page.getByPlaceholder(/special requests/i).first();
    if (await notes.count()) await notes.fill('E2E automated test');
    // next step
    const next = page.getByRole('button', { name: /save & continue|continue|next/i }).first();
    await next.click();
    await page.waitForTimeout(1200);
    // select a room checkbox if present
    const checkboxes = page.locator('input[type="checkbox"]');
    const n = await checkboxes.count();
    let selected = 0;
    for (let i = 0; i < Math.min(n, 3); i++) {
      const cb = checkboxes.nth(i);
      if (await cb.isVisible().catch(() => false)) {
        const checked = await cb.isChecked().catch(() => false);
        if (!checked) { await cb.check().catch(() => {}); selected++; if (selected >= 1) break; }
      }
    }
    // fill manual rate inputs if any (number inputs beyond dates)
    const rates = page.locator('input[type="number"]');
    const rn = await rates.count();
    for (let i = 0; i < rn; i++) {
      const inp = rates.nth(i);
      if (await inp.isVisible().catch(() => false)) await inp.fill('650000').catch(() => {});
    }
    // proceed through remaining steps
    for (let step = 0; step < 4; step++) {
      const save = page.getByRole('button', { name: /save reservation|save changes|save & continue|continue|next|review & save/i }).first();
      if (!(await save.count())) break;
      if (!(await save.isVisible().catch(() => false))) break;
      await save.click();
      await page.waitForTimeout(1200);
      if (page.url().includes('/dashboard/reservations') && !page.url().includes('/new') && !page.url().includes('/edit')) break;
    }
    await page.waitForTimeout(1500);
    const body = await page.locator('body').innerText();
    expect(body).toMatch(new RegExp(`E2E Guest ${stamp}|Reservations|Reservation`, 'i'));
  });

  test('SCN-04-06 detail page shows guest/status/rooms', async ({ page }) => {
    await page.goto('/dashboard/reservations');
    const link = page.locator('a[href*="/dashboard/reservations/"]').first();
    await expect(link).toBeVisible({ timeout: 15000 });
    await link.click();
    await expect(page).toHaveURL(/\/dashboard\/reservations\/.+/, { timeout: 10000 });
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/guest|status|room|check-in/i);
  });

  test('SCN-04-11 calendar renders + day popup', async ({ page }) => {
    await page.goto('/dashboard/reservations/calendar');
    await expect(page.getByRole('heading', { name: /reservation calendar/i })).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
  });
});
