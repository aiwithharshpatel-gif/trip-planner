import { test, expect } from '@playwright/test';

test.describe('Trip Generation Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Scenario A: User can plan a trip (Happy Path)', async ({ page }) => {
        // 1. Fill input with mocking trigger
        const input = page.getByRole('textbox');
        await input.fill('MOCK_GENERATE: 3 days in Tokyo');

        // 2. Click Plan Trip
        const button = page.getByRole('button', { name: /Generate Trip/i });
        await button.click();

        // 3. Verify loading state (optional, but good for UX check)
        // await expect(button).toBeDisabled();

        // 4. Expect redirection to trip page
        await expect(page).toHaveURL(/\/trips\/.+/);

        // 5. Verify Timeline Cards
        // We mocked 3 days in tripData.ts
        const dayHeaders = page.locator('[id^="day-"]');
        await expect(dayHeaders).toHaveCount(3);

        // Check for specific content from mock
        await expect(page.getByText('Arrival and Shinjuku')).toBeVisible();
    });

    test('Scenario B: Map loads correctly', async ({ page }) => {
        // Run the generation flow first
        const input = page.getByRole('textbox');
        await input.fill('MOCK_GENERATE: 3 days in Tokyo');
        await page.getByRole('button', { name: /Generate Trip/i }).click();
        await expect(page).toHaveURL(/\/trips\/.+/);

        // Verify Map Container exists
        const map = page.locator('.leaflet-container');
        await expect(map).toBeVisible();

        // Check for markers (Leaflet markers usually have class 'leaflet-marker-icon')
        // We need to wait for map to initialize and render markers
        const markers = page.locator('.leaflet-marker-icon');
        // We have 3 activities in mock data, expecting at least 1 or 3 markers
        // Depending on if the map renders all or clusters. Leaflet usually renders all by default.
        await expect(markers).toHaveCount(3);
    });
});
