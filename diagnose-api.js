const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GOOGLE_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModelsRaw() {
    console.log("Testing URL:", url.replace(apiKey, "HIDDEN_KEY"));

    try {
        const response = await fetch(url);
        console.log("Status:", response.status);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available Models:");
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log("❌ No models found or error:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

listModelsRaw();
