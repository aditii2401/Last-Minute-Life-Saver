function TaskCard({ task, onDelete, onEdit, onToggleComplete, onAnalyze, isLoading, isCurrentAnalysis }) {
  return (
    <div className={`p-3.5 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
      task.completed 
        ? "bg-slate-50 border-slate-200/50 opacity-40" 
        : isCurrentAnalysis 
          ? "bg-white border-indigo-400 shadow-sm ring-1 ring-indigo-400/20"
          : "bg-white border-slate-200/70 hover:border-slate-300 shadow-sm"
    }`}>
      
      <div className="flex items-start gap-3 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          className="w-4 h-4 mt-0.5 rounded border-slate-300 bg-slate-50 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-600 shrink-0"
        />
        <div className="min-w-0">
          <h4 className={`text-xs font-bold text-slate-800 tracking-tight ${task.completed ? "line-through text-slate-400" : ""}`}>
            {task.taskName}
          </h4>
          {task.description && (
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold">
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
            task.priority === "High" ? "bg-rose-50 text-rose-600 border border-rose-100" :
            task.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
            "bg-emerald-50 text-emerald-600 border border-emerald-100"
          }`}>
            {task.priority}
          </span>
          <span className="text-slate-400">{task.deadline}</span>
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 text-xs font-bold">
          <button
            onClick={() => onAnalyze(task)}
            disabled={isLoading || task.completed}
            className={`text-xs font-bold transition-colors ${
              isCurrentAnalysis ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"
            }`}
          >
            {isLoading ? "⏳" : "🔮 Copilot"}
          </button>

          <button
            onClick={() => onEdit(task)}
            className="text-slate-400 hover:text-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>✏️</span> <span className="text-[11px]">Edit</span>
          </button>

          {task.completed && (
            <button
              onClick={() => onToggleComplete(task)}
              className="text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <span>↩️</span> <span className="text-[11px]">Undo</span>
            </button>
          )}

          <button
            onClick={() => onDelete(task.id)}
            className="text-slate-300 hover:text-rose-500 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

    </div>
  );
}

export default TaskCard;