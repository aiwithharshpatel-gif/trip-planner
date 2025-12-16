"use server";

import { model } from "@/lib/ai/gemini";
import { TRIP_GENERATOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { Trip } from "@/types";
import { parseTripResponse } from "@/lib/ai/parser";
import { mockTripData } from "@/tests/mocks/tripData";
import { getWikipediaImage } from "@/lib/services/wikipedia";

export async function generateTrip(input: string): Promise<{ success: boolean; data?: Trip; error?: string }> {
    if (!input || input.trim().length < 5) {
        return { success: false, error: "Please provide a more detailed trip request." };
    }

    // Enable Mock Mode for Testing
    if (input.includes("MOCK_GENERATE") || process.env.MOCK_AI === 'true') {
        const simulatedDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await simulatedDelay(1000); // Simulate network latency
        return { success: true, data: mockTripData };
    }

    try {
        // Note: Template literal usage here was previously causing syntax issues if not careful with escaping.
        // We construct the prompt simply.
        const prompt = `User Request: "${input}"\n\n${TRIP_GENERATOR_SYSTEM_PROMPT}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const tripData = parseTripResponse(text);

        // Enrich with Images (Server-Side)
        // We limit parallel requests to avoid hitting rate limits or timeouts
        const enrichedDays = await Promise.all(tripData.days.map(async (day) => {
            const enrichedActivities = await Promise.all(day.activities.map(async (activity) => {
                // Try to find an image for the location or the activity title
                const query = activity.location?.name || activity.title;
                const imageUrl = await getWikipediaImage(query);
                return { ...activity, imageUrl: imageUrl || undefined };
            }));
            return { ...day, activities: enrichedActivities };
        }));

        tripData.days = enrichedDays;

        return { success: true, data: tripData };

    } catch (error: any) {
        console.error("Trip Generation Error:", error);

        // Debugging: Return actual error message to client to help user on Vercel
        const errorMessage = error?.message || "Unknown error";

        return {
            success: false,
            error: `Failed to generate itinerary: ${errorMessage}. (Check Vercel Logs or API Keys)`
        };
    }
}
