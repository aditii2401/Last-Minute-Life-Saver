import { useState, useEffect } from "react";

const QUIRKY_MESSAGES = {
  high: [
    "🚨 Code Red! Your high priority tasks are waiting. They aren't going to execute themselves.",
    "👀 High priority deadline approaching. Panic is not an option—focus is.",
    "🔥 Target priority node outstanding. Clear the schedule and resolve the blockage.",
  ],
  cluttered: [
    "📦 Workspace density expanding. Recommend executing a quick cleanup loop.",
    "🧘 Pipeline layout crowded. Let's isolate and structure your pending parameters.",
    "🌪️ Tracking limits reaching capacity. Let's optimize your workspace density.",
  ],
  clear: [
    "🎉 Pipeline clean! Go clear your head, you've completely crushed it.",
    "😎 Zero execution anomalies detected. Your upcoming calendar timeline is clear.",
    "✨ Peace and order. Your operational database is fully optimized.",
  ],
};

function QuirkyAlert({ tasks }) {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const pendingTasks = tasks.filter((t) => !t.completed);
    const hasHighPriority = pendingTasks.some((t) => t.priority === "High");

    let messagePool = QUIRKY_MESSAGES.cluttered;
    if (pendingTasks.length === 0) {
      messagePool = QUIRKY_MESSAGES.clear;
    } else if (hasHighPriority) {
      messagePool = QUIRKY_MESSAGES.high;
    }

    const randomIndex = Math.floor(Math.random() * messagePool.length);
    
    const showTimer = setTimeout(() => {
      setAlert(messagePool[randomIndex]);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, [tasks]);

  // Exact 5-Second Self-Dismissal Runtime Thread
  useEffect(() => {
    if (!alert) return;

    const dismissTimer = setTimeout(() => {
      setAlert(null);
    }, 5000);

    return () => clearTimeout(dismissTimer);
  }, [alert]);

  if (!alert) return null;

  return (
    <div className="fixed top-6 left-6 z-50 max-w-sm bg-white/95 backdrop-blur-md text-slate-800 p-4 rounded-xl shadow-xl border border-slate-200/80 animate-fadeIn flex items-start gap-3">
      <div className="text-base">💬</div>
      <div>
        <span className="text-[10px] font-black tracking-wider text-indigo-600 uppercase block mb-1">
          System Broadcast
        </span>
        <p className="text-xs font-medium leading-relaxed text-slate-600">{alert}</p>
      </div>
    </div>
  );
}

export default QuirkyAlert;