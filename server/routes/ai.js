import express from "express";
import { analyze, processVoiceCommand } from "../controllers/aiController.js";

const router = express.Router();

// Existing task analysis route
router.post("/analyze", analyze);

// NEW: Gemini Voice Assistant route
router.post("/voice-command", processVoiceCommand);

export default router;