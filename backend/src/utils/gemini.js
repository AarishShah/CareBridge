const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.env.GEMINI_API_KEY;

// Initialize the Gemini AI API with your API key
const genAI = new GoogleGenerativeAI(key);

async function testGeminiApiKey() {
    try {
        const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const prompt = "Say this is a test.";
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const message = response.text();

        console.log("API Key is working! Response from Gemini AI:", message);
    } catch (error) {
        console.error("Error with Gemini AI API:", error);
    }
}

testGeminiApiKey();
