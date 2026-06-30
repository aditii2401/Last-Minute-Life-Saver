import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

console.log("Key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "Say hello",
});

console.log(response.candidates[0].content.parts[0].text);