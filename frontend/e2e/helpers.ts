import { test, expect, Page } from '@playwright/test';

export const ADMIN = { email: 'admin@hotel.com', password: 'admin123' };
export const MANAGER = { email: 'manager@hotel.com', password: 'manager123' };
export const STAFF = { email: 'staff@hotel.com', password: 'staff123' };
export const INACTIVE = { email: 'inactive@hotel.com', password: 'inactive123' };

export const consoleErrors: { url: string; message: string }[] = [];
export const pageErrors: { url: string; message: string }[] = [];

export function attachErrorCollectors(page: Page) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({ url: page.url(), message: msg.text().slice(0, 500) });
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push({ url: page.url(), message: String(err?.message || err).slice(0, 500) });
  });
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('john@hotel.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  await page.getByRole('button', { name: /^Login$/ }).click();
}

export async function loginAsAdmin(page: Page) {
  await login(page, ADMIN.email, ADMIN.password);
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
}

export async function logout(page: Page) {
  // Sidebar logout button (text Logout) or rail aria-label
  const logoutBtn = page.getByRole('button', { name: /logout/i }).first();
  if (await logoutBtn.count()) {
    await logoutBtn.click();
  }
}
