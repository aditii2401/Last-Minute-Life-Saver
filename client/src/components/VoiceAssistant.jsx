import { useState } from "react";

function VoiceAssistant({ onRefreshTasks }) {
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState("Hi! Tap the mic and speak a command in English or Hinglish.");

  const sendVoiceIntentToBackend = async (text) => {
    if (!text.trim()) return;
    try {
      setAiResponse("🤖 Processing your intent...");
      
      const response = await fetch("http://localhost:5000/api/voice-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: text }),
      });

      const data = await response.json();

      if (data.success) {
        setAiResponse(data.reply);

        const { db } = await import("../services/firebase");
        const { collection, addDoc, getDocs, updateDoc, doc } = await import("firebase/firestore");

        // INTENT 1: AUTONOMOUS ADDITION
        if (data.action === "ADD_TASK" && data.taskData) {
          await addDoc(collection(db, "tasks"), {
            taskName: data.taskData.taskName,
            description: data.taskData.description || "",
            deadline: data.taskData.deadline || new Date().toISOString().split('T')[0],
            priority: data.taskData.priority || "Medium",
            completed: false,
            createdAt: new Date(),
          });
          onRefreshTasks();
        }

        // INTENT 2: AUTONOMOUS COMPLETION
        if (data.action === "COMPLETE_TASK" && data.taskData) {
          const querySnapshot = await getDocs(collection(db, "tasks"));
          const targetKeyword = data.taskData.taskName.toLowerCase();
          
          let matchedTask = null;
          querySnapshot.forEach((document) => {
            const currentName = document.data().taskName.toLowerCase();
            if (currentName.includes(targetKeyword)) {
              matchedTask = { id: document.id, ...document.data() };
            }
          });

          if (matchedTask) {
            await updateDoc(doc(db, "tasks", matchedTask.id), { completed: true });
            setAiResponse(`✅ Autonomously completed: "${matchedTask.taskName}"`);
            onRefreshTasks();
          } else {
            setAiResponse(`⚠️ Couldn't find an open task matching "${data.taskData.taskName}".`);
          }
        }
      } else {
        setAiResponse("⚠️ Sorry, I couldn't process that command.");
      }
    } catch (error) {
      console.error(error);
      setAiResponse("❌ Error connecting to AI voice server.");
    }
  };

  const handleVoiceListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser window.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    
    // Configured for bilingual / Hinglish tracking
    recognition.lang = "hi-IN"; 

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      sendVoiceIntentToBackend(speechToText);
    };

    recognition.onerror = () => {
      alert("Mic access error. Please check your browser permission settings!");
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={handleVoiceListen}
          className={`p-3 rounded-full text-white transition-all ${
            isListening ? "bg-red-500 animate-pulse scale-110" : "bg-purple-600 hover:bg-purple-700"
          }`}
          title="Click to speak command"
        >
          🎙️
        </button>
        <div>
          <h4 className="text-sm font-bold text-slate-800">AI Copilot Command Center</h4>
          <p className="text-[11px] text-gray-400 font-medium">Bilingual Agentic Engine</p>
        </div>
      </div>

      <div className="bg-slate-50 border rounded-xl p-3 text-xs text-slate-600 min-h-[60px] font-medium leading-relaxed shadow-inner">
        {aiResponse}
      </div>
    </div>
  );
}

export default VoiceAssistant;