const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GOOGLE_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : "";

const versions = ['v1', 'v1beta'];

async function scan() {
    console.log(`🔑 Key: ${apiKey.substring(0, 10)}...`);

    for (const v of versions) {
        console.log(`\n🔎 Scanning API version: ${v}...`);
        const url = `https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.models) {
                const geminiModels = data.models.filter(m => m.name.includes('gemini'));
                if (geminiModels.length > 0) {
                    console.log(`✅ FOUND GEMINI MODELS in ${v}:`);
                    geminiModels.forEach(m => console.log(`   - ${m.name}`));
                } else {
                    console.log(`⚠️ No 'gemini' models found in ${v}. Found ${data.models.length} other models (e.g., ${data.models[0]?.name}).`);
                }
            } else {
                console.log(`❌ Error in ${v}:`, data.error?.message || data);
            }
        } catch (e) {
            console.error(`❌ Network error for ${v}:`, e.message);
        }
    }
}

scan();
