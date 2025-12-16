import { Trip } from "@/types";

export function parseTripResponse(response: string): Trip {
    if (!response) {
        throw new Error("Empty response from AI");
    }

    try {
        // Clean markdown formatting
        const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();

        // Parse JSON
        const parsed = JSON.parse(cleaned);

        // Basic validation (can be expanded with Zod later)
        if (!parsed.days || !Array.isArray(parsed.days)) {
            throw new Error("Invalid schema: missing 'days' array");
        }

        return parsed as Trip;
    } catch (e) {
        if (e instanceof Error) {
            throw new Error(`Failed to parse trip data: ${e.message}`);
        }
        throw new Error("Failed to parse trip data");
    }
}
