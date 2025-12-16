const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GOOGLE_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";

// Test Query: "Eiffel Tower"
const url = `https://places.googleapis.com/v1/places:searchText`;

async function testPlaces() {
    console.log(`🔑 Key: ${apiKey.substring(0, 5)}...`);
    console.log("📡 Testing Google Places API (New)...");

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.photos,places.rating'
            },
            body: JSON.stringify({
                textQuery: "Eiffel Tower, Paris"
            })
        });

        console.log("Status:", response.status);
        const data = await response.json();

        if (response.ok && data.places && data.places.length > 0) {
            console.log("✅ Success! Found place:", data.places[0].displayName.text);
            if (data.places[0].photos) {
                console.log("📸 Has photos available.");
            }
        } else {
            console.error("❌ Places API Failed:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

testPlaces();
