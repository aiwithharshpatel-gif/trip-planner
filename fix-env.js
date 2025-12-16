const fs = require('fs');
const path = require('path');

const content = `GOOGLE_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
`;

const filePath = path.join(__dirname, '.env.local');

try {
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    console.log('✅ Successfully wrote .env.local with UTF-8 encoding.');
} catch (error) {
    console.error('❌ Failed to write .env.local:', error);
}
