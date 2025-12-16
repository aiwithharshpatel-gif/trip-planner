import { describe, it, expect } from 'vitest';
import { parseTripResponse } from '@/lib/ai/parser';
import { mockTripData } from '@/tests/mocks/tripData';

describe('Trip Parser Logic', () => {
    it('should parse valid JSON correctly', () => {
        const jsonString = JSON.stringify(mockTripData);
        const result = parseTripResponse(jsonString);
        expect(result).toEqual(mockTripData);
    });

    it('should handle markdown code blocks', () => {
        const jsonString = JSON.stringify(mockTripData);
        const markdownString = `\`\`\`json\n${jsonString}\n\`\`\``;
        const result = parseTripResponse(markdownString);
        expect(result).toEqual(mockTripData);
    });

    it('should throw error for invalid JSON', () => {
        const badJson = "{ invalid: json ";
        expect(() => parseTripResponse(badJson)).toThrow(/Failed to parse trip data/);
    });

    it('should throw error for valid JSON but missing schema', () => {
        const incompleteData = JSON.stringify({ title: "No Days" });
        expect(() => parseTripResponse(incompleteData)).toThrow(/Invalid schema/);
    });

    it('should throw error for empty response', () => {
        expect(() => parseTripResponse("")).toThrow("Empty response from AI");
    });
});
