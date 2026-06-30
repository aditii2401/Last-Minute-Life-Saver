import { useState } from "react";
import { addEventToCalendar } from "../services/calendar";

function SmartPlanner({ tasks }) {
  const [loadingId, setLoadingId] = useState(null);

  const pendingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  const startHour = 9; // Planner starts at 9 AM

  const handlePushToCalendar = async (task, hour) => {
    try {
      setLoadingId(task.id);

      const today = new Date();
      const startTime = new Date(today.setHours(hour, 0, 0, 0)).toISOString();
      const endTime = new Date(today.setHours(hour + 1, 0, 0, 0)).toISOString();

      await addEventToCalendar(task.taskName, task.description, startTime, endTime);
      alert(`✅ Success! "${task.taskName}" added to Google Calendar at ${hour}:00.`);
    } catch (error) {
      console.error(error);
      alert("Failed to add to calendar. Make sure you logged in with Google!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
        <span className="text-xs">🤖</span>
        <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">
          AI Smart Planner
        </h3>
      </div>

      {pendingTasks.length === 0 ? (
        <p className="text-xs text-slate-400 font-medium italic py-1">
          🎉 All tasks completed for today!
        </p>
      ) : (
        /* Dense scrollable container capped at 180px max height */
        <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
          {pendingTasks.map((task, index) => {
            const hour = startHour + index * 2;

            return (
              <div 
                key={task.id} 
                className="flex items-center justify-between gap-3 p-2 bg-slate-50 border border-slate-200/60 rounded-lg transition-colors hover:bg-slate-100/50"
              >
                {/* Text Node Container */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-700 truncate leading-tight">
                    {task.taskName}
                  </h4>
                  <span className={`text-[9px] font-black uppercase mt-0.5 inline-block ${
                    task.priority === "High" ? "text-rose-600" :
                    task.priority === "Medium" ? "text-amber-600" : "text-emerald-600"
                  }`}>
                    {task.priority}
                  </span>
                </div>

                {/* Interactive Controls aligned horizontally */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono font-black text-indigo-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                    {hour}:00
                  </span>
                  
                  <button
                    onClick={() => handlePushToCalendar(task, hour)}
                    disabled={loadingId === task.id}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-md transition-all active:scale-[0.97] border border-indigo-100/70 disabled:opacity-50 cursor-pointer"
                  >
                    {loadingId === task.id ? "Adding..." : "📅 Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SmartPlanner;