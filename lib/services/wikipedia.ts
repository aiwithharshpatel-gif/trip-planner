export async function getWikipediaImage(query: string): Promise<string | null> {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrlimit=1&prop=pageimages&pithumbsize=500&origin=*&gsrsearch=${encodeURIComponent(query)}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.query || !data.query.pages) {
            return null;
        }

        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];

        if (page.thumbnail && page.thumbnail.source) {
            return page.thumbnail.source;
        }

        return null;
    } catch (error) {
        console.error(`Wikipedia API Error for ${query}:`, error);
        return null;
    }
}
