import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.warn("Missing GOOGLE_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});
