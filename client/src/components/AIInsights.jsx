import { useState, useEffect } from "react";

function AIInsights({ selectedTask, tasks, loadingTaskId }) {
  const [cachedSuggestions, setCachedSuggestions] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      const liveTask = tasks?.find((t) => t.id === selectedTask.id) || selectedTask;
      const rawData = liveTask.aiSuggestions || liveTask.aiSuggestion;
      if (rawData) {
        setCachedSuggestions(rawData);
      } else {
        setCachedSuggestions(null);
      }
    }
  }, [selectedTask, tasks]);

  if (!selectedTask) {
    return (
      <div className="min-h-[75px] flex flex-col justify-center items-center text-center p-3">
        <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-0.5">
          🔮 AI Suggestions
        </span>
        <p className="text-[11px] text-slate-400 font-medium max-w-sm leading-relaxed">
          Select "🔮 Copilot" on any pipeline task below to generate strategy breakdowns.
        </p>
      </div>
    );
  }

  const isCurrentTaskLoading = loadingTaskId === selectedTask.id;
  
  let parsedContent = cachedSuggestions;
  let isObjectData = false;

  // 🧠 BULLETPROOF PARSING LOOP
  if (cachedSuggestions) {
    if (typeof cachedSuggestions === "object" && cachedSuggestions !== null) {
      parsedContent = cachedSuggestions;
      isObjectData = true;
    } else if (typeof cachedSuggestions === "string") {
      let cleanString = cachedSuggestions.trim();
      if (cleanString.startsWith("```json")) {
        cleanString = cleanString.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleanString.startsWith("```")) {
        cleanString = cleanString.replace(/^```/, "").replace(/```$/, "").trim();
      }

      try {
        const parsed = JSON.parse(cleanString);
        if (typeof parsed === "object" && parsed !== null) {
          parsedContent = parsed;
          isObjectData = true;
        }
      } catch (e) {
        parsedContent = cachedSuggestions;
        isObjectData = false;
      }
    }
  }

  return (
    <div className="transition-all duration-200 min-h-[75px] flex flex-col justify-center">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2.5">
        <span className="text-[10px] font-black tracking-wider text-indigo-600 uppercase">
          🔮 AI Suggestions — {selectedTask.taskName}
        </span>
      </div>

      <div className="px-0.5">
        {isCurrentTaskLoading ? (
          <div className="flex items-center gap-2 py-1 text-[11px] text-slate-400 font-medium animate-pulse">
            <span>⏳</span> Processing completion strategy inference vectors...
          </div>
        ) : parsedContent ? (
          <div className="text-[11px] text-slate-600 leading-relaxed font-medium bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 max-h-[220px] overflow-y-auto scrollbar-thin">
            {isObjectData ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5 text-[9px] font-mono font-bold uppercase">
                  {parsedContent.difficulty && (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200/50 px-1.5 py-0.5 rounded">
                      Complexity: {parsedContent.difficulty}
                    </span>
                  )}
                  {parsedContent.estimatedHours && (
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/50 px-1.5 py-0.5 rounded">
                      Duration: {parsedContent.estimatedHours} hrs
                    </span>
                  )}
                </div>

                {parsedContent.subtasks && Array.isArray(parsedContent.subtasks) && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block">
                      Task Breakdown Action Steps:
                    </span>
                    <ul className="space-y-0.5 pl-0.5">
                      {parsedContent.subtasks.map((subtask, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-700 text-[11px]">
                          <span className="text-indigo-500 text-[9px]">■</span>
                          <span className="truncate">
                            {typeof subtask === 'object' ? JSON.stringify(subtask) : subtask}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 💡 NEW: Strategy Template Render Block */}
                {parsedContent.aiTemplate && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                    <span className="text-[9px] font-black tracking-wider text-indigo-600 uppercase block mb-1">
                      💡 Strategy Template / Resources:
                    </span>
                    <p className="text-[11px] text-slate-700 bg-indigo-50/30 border border-indigo-100/50 p-2 rounded-md font-mono whitespace-pre-line leading-relaxed">
                      {parsedContent.aiTemplate}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-line text-slate-700">{String(parsedContent)}</p>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 font-medium italic py-1">
            Awaiting response pipeline package... Check backend terminal connections.
          </p>
        )}
      </div>
    </div>
  );
}

export default AIInsights;