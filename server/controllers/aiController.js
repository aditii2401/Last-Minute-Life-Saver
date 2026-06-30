// server/controllers/aiController.js
import * as googleGenAI from "@google/genai";

// Initialize the Gemini SDK using the namespace class
const ai = new googleGenAI.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Keep the rest of your file (export async function analyze...) exactly the same!

/**
 * 1. Analyzes a task to provide step-by-step roadmap shortcuts and email templates
 */
export async function analyze(req, res) {
  try {
    // 🛠️ Deconstruct both fields arriving from the frontend body payload
    const { task, description } = req.body;

    const prompt = `You are an AI micro-assistant inside a task tracking dashboard built for student and professional engineering pipelines.
The user needs a completion roadmap strategy for this specific item:
- Task Title: "${task}"
- Detailed Explanation/Context: "${description}"

Analyze BOTH parameters closely. If the description contains formulas, assignment steps, or specific requirements, customize your response exactly to match that context.

Return ONLY a clean JSON object with this exact structure:
{
  "difficulty": "Low", "Medium", or "High",
  "estimatedHours": 2,
  "subtasks": ["Step 1...", "Step 2...", "Step 3..."],
  "aiTemplate": "If it is an email/letter, provide a ready-to-customize text template here. If it is a technical project, study topic, or practical assignment, provide a vital hint, formula, code setup, or specific roadmap breakdown matching the explanation. Max 4-5 lines."
}
Do not include any markdown format blocks like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanText = response.candidates[0].content.parts[0].text.trim();
    const result = JSON.parse(cleanText);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI Error in Analyze:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * 2. Processes natural language voice intents to auto-add tasks
 */
// server/controllers/aiController.js (Updated Function)
export async function processVoiceCommand(req, res) {
  try {
    const { command } = req.body;

    // Inside server/controllers/aiController.js -> processVoiceCommand
    const prompt = `You are a bilingual AI Voice assistant built into a task management dashboard for Indian students and professionals.
The user just spoke this command (which may be in English, Hindi, or a mix of both called Hinglish): "${command}"

Examples of Hinglish commands you must handle:
1. "Ek high priority task add karo to practice arrays tomorrow" -> Should ADD_TASK with name "Practice Arrays", priority "High", deadline calculated for tomorrow.
2. "DBMS assignment complete ho gaya hai use done mark kar do" -> Should COMPLETE_TASK with taskName "DBMS assignment".
3. "Kal subah mujhe placement round ki prep karni hai" -> Should ADD_TASK with name "Placement Round Prep", deadline calculated for tomorrow.

Analyze the user's intent. Return ONLY a valid JSON structure matching this exact format:
{
  "action": "ADD_TASK" or "COMPLETE_TASK" or "GENERAL_REPLY",
  "reply": "A short, friendly confirmation reply back to the user in clean English explaining what you autonomously executed.",
  "taskData": {
    "taskName": "Extracted task name translated completely into clear English",
    "description": "Short translated description if adding",
    "priority": "High", "Medium", or "Low" (Default to Medium if not specified),
    "deadline": "2026-06-29" (If they specify a time context like 'kal', 'tomorrow', or 'agla hafta', calculate it relative to the current date: 2026-06-29)
  }
}
Do not return any markdown wraps like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanText = response.candidates[0].content.parts[0].text.trim();
    const result = JSON.parse(cleanText);

    res.status(200).json({
      success: true,
      action: result.action,
      reply: result.reply,
      taskData: result.taskData
    });
  } catch (error) {
    console.error("AI Error in Voice Command:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}