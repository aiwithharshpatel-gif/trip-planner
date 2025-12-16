import { describe, it, expect } from 'vitest';
import { getWikipediaImage } from '@/lib/services/wikipedia';

describe('Wikipedia Service', () => {
    it('should fetch an image for a known landmark', async () => {
        const imageUrl = await getWikipediaImage("Eiffel Tower");
        expect(imageUrl).toBeDefined();
        expect(typeof imageUrl).toBe('string');
        expect(imageUrl).toContain('https://');
        console.log("Fetched Image URL:", imageUrl);
    });

    it('should return null for a nonsense query', async () => {
        const imageUrl = await getWikipediaImage("fasdfjasdfkjasdfkjasdfjkasdf");
        expect(imageUrl).toBeNull();
    });
});
