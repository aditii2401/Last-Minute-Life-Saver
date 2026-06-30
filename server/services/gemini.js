import { GoogleGenAI } from "@google/genai";

// Initialize the SDK using your environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeTask(taskName) {
  console.log("Analyzing live task:", taskName);
  
  const prompt = `You are an AI productivity advisor. Break down the following task into a structured plan.
Task Name: "${taskName}"

Return ONLY a clean JSON object containing:
- difficulty (String: "Low", "Medium", or "High")
- estimatedHours (Number)
- subtasks (Array of Strings containing actionable subtasks)

Ensure the output is raw JSON, without markdown formatting blocks like \`\`\`json.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.candidates[0].content.parts[0].text.trim();
    
    // Parse it securely back into an object for your frontend controller
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini processing error:", error);
    throw new Error("Failed to process task breakdown via AI");
  }
}