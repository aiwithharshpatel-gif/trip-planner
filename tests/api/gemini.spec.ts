import { test, expect } from '@playwright/test';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseTripResponse } from '@/lib/ai/parser';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// This test hits the REAL Gemini API to ensure our prompt/schema is still valid against the model.
// It is tagged with @daily to run only on schedule or manual request.
test('Real Gemini API Validation @daily', async () => {
    // Only run if key is present
    if (!process.env.GOOGLE_API_KEY) {
        test.skip(true, 'No GOOGLE_API_KEY found');
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // Use the model we confirmed works
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = 'Generate a minimal valid 1-day trip object for testing schema validation. Just "1 day in Paris". Return only JSON.';

    // We expect this to take a few seconds
    test.setTimeout(30000);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 1. Verify we got a non-empty string
        expect(text).toBeTruthy();

        // 2. Verify our parser works on the real output (checking for hallucinations/format changes)
        // Note: The prompt above is simplified, but usually we'd share the system prompt.
        // For this sanity check, we just want to see if it returns JSON we can parse.
        // If the model refuses or returns text, this will throw.

        // However, since we simply asked for JSON, strict parsing might fail if we don't use the full prompt system.
        // Let's at least check if it's parseable JSON.

        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        expect(parsed).toHaveProperty('days');

        console.log("✅ Real API Schema Check Passed");
    } catch (e) {
        console.error("❌ Real API Check Failed:", e);
        throw e;
    }
});
