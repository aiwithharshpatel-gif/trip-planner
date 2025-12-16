const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

async function listModels() {
    try {
        const envPath = path.join(__dirname, ".env.local");
        const envContent = fs.readFileSync(envPath, "utf8");
        const apiKeyMatch = envContent.match(/GOOGLE_API_KEY=(.+)/);

        if (!apiKeyMatch) {
            console.error("❌ Could not find GOOGLE_API_KEY in .env.local");
            return;
        }

        const apiKey = apiKeyMatch[1].trim();
        const genAI = new GoogleGenerativeAI(apiKey); // No model needed for listing

        // Access the model manager directly if possible, or try a known model
        // The SDK doesn't always expose listModels directly on the main class easily in all versions,
        // but we can try a standard request or just fallback to trying 'gemini-pro'

        console.log("📡 Attempting to use 'gemini-pro' as fallback check...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello?");
        const response = await result.response;
        console.log("✅ 'gemini-pro' works!");

        console.log("📡 Attempting to use 'gemini-1.5-flash'...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Hello?");
        console.log("✅ 'gemini-1.5-flash' works!");

    } catch (error) {
        console.error("❌ Model Check Failed:", error.message);
    }
}

listModels();
