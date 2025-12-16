export async function getCoordinates(query: string): Promise<{ lat: number; lng: number } | null> {
    try {
        // Nominatim requires a User-Agent identify your application
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TripPlannerAI/1.0 (educational project)'
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }

        return null;
    } catch (error) {
        console.error(`Nominatim API Error for ${query}:`, error);
        return null;
    }
}
