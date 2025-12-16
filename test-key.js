const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

async function testConnection() {
    try {
        // Manually parse .env.local because we are running with plain node
        const envPath = path.join(__dirname, ".env.local");
        const envContent = fs.readFileSync(envPath, "utf8");
        const apiKeyMatch = envContent.match(/GOOGLE_API_KEY=(.+)/);

        if (!apiKeyMatch) {
            console.error("❌ Could not find GOOGLE_API_KEY in .env.local");
            return;
        }

        const apiKey = apiKeyMatch[1].trim();
        console.log("🔑 Found API Key:", apiKey.substring(0, 5) + "...");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        console.log("📡 Testing connection to gemini-2.5-flash...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        const text = response.text();

        console.log("✅ Success! Response:", text);

    } catch (error) {
        console.error("❌ API Test Failed:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Status Text:", error.response.statusText);
        }
    }
}

testConnection();
