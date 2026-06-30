function UpcomingDeadlines({ tasks }) {
  const pendingTasks = tasks.filter((t) => !t.completed);

  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase mb-3 block">
        📅 Upcoming Timeline Constraints
      </span>

      {pendingTasks.length === 0 ? (
        <p className="text-xs text-slate-400 font-medium italic py-2">
          Zero active operational deadlines detected.
        </p>
      ) : (
        /* Enforced boundary matrix context layout */
        <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {pendingTasks.map((task) => (
            <div key={task.id} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/50">
              <span className="text-xs font-bold text-slate-700 truncate">{task.taskName}</span>
              <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                {task.deadline}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpcomingDeadlines;