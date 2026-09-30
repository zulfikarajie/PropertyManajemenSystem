import { test, expect } from '@playwright/test';
import { attachErrorCollectors } from './helpers';

test.describe('SCN-01 Public website', () => {
  test('SCN-01-01 home loads with hero + CTAs', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /selamat datang/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('link', { name: /lihat kamar/i }).first()).toBeVisible();
    await expect(page.getByText(/whatsapp/i).first()).toBeVisible();
  });

  test('SCN-01-02 public navigation all pages 200', async ({ page }) => {
    attachErrorCollectors(page);
    for (const url of ['/', '/rooms', '/about', '/gallery', '/contact']) {
      const resp = await page.goto(url);
      expect(resp?.status(), url).toBe(200);
      await expect(page.locator('body')).toContainText(/./);
    }
    // nav links
    await page.goto('/');
    await page.getByRole('link', { name: /lihat kamar/i }).first().click();
    await expect(page).toHaveURL(/\/rooms/);
  });

  test('SCN-01-04/05/06 rooms gallery about render', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/rooms');
    await expect(page.locator('body')).toContainText(/kamar|room/i);
    await page.goto('/gallery');
    await expect(page.locator('body')).toContainText(/galeri|gallery/i);
    await page.goto('/about');
    await expect(page.locator('body')).toContainText(/tentang|about|properti|hotel/i);
  });

  test('SCN-01-07 contact WhatsApp CTA has wa link', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /hubungi kami/i })).toBeVisible();
    const wa = page.locator('a[href*="wa.me"], a[href*="whatsapp"], a[href*="api.whatsapp"]').first();
    await expect(wa).toBeVisible();
    const href = await wa.getAttribute('href');
    expect(href, 'whatsapp href').toMatch(/wa\.me|whatsapp/i);
  });

  test('SCN-01-08 404 page', async ({ page }) => {
    attachErrorCollectors(page);
    await page.goto('/route-tidak-ada-xyz-123');
    await expect(page.locator('body')).toContainText(/404|tidak ditemukan|not found/i);
  });

  test('SCN-01-09 mobile 375px no horizontal overflow', async ({ page }) => {
    attachErrorCollectors(page);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow=${overflow}`).toBeLessThanOrEqual(1);
  });
});
