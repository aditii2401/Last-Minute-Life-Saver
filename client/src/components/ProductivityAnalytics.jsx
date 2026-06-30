function ProductivityAnalytics({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  const high = tasks.filter(task => task.priority === "High").length;
  const medium = tasks.filter(task => task.priority === "Medium").length;
  const low = tasks.filter(task => task.priority === "Low").length;

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
        <span className="text-xs">📊</span>
        <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase">
          Productivity Analytics
        </h3>
      </div>

      {/* Clean micro-grid layout parameters preventing sideways text overflows */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
        <div className="bg-blue-50/50 border border-blue-100 p-2 rounded-lg flex flex-col justify-center min-h-[52px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">Rate</span>
          <span className="text-xs font-black text-blue-600 mt-0.5">{completionRate}%</span>
        </div>

        <div className="bg-green-50/50 border border-green-100 p-2 rounded-lg flex flex-col justify-center min-h-[52px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">Completed</span>
          <span className="text-xs font-black text-green-600 mt-0.5">{completed}</span>
        </div>

        <div className="bg-red-50/50 border border-red-100 p-2 rounded-lg flex flex-col justify-center min-h-[52px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">Pending</span>
          <span className="text-xs font-black text-red-600 mt-0.5">{pending}</span>
        </div>

        <div className="bg-red-100/40 border border-red-200/60 p-2 rounded-lg flex flex-col justify-center min-h-[52px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">High Prio</span>
          <span className="text-xs font-black text-red-700 mt-0.5">{high}</span>
        </div>

        <div className="bg-yellow-100/40 border border-yellow-200/60 p-2 rounded-lg flex flex-col justify-center min-h-[52px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">Med Prio</span>
          <span className="text-xs font-black text-yellow-700 mt-0.5">{medium}</span>
        </div>

        <div className="bg-green-100/40 border border-green-200/60 p-2 rounded-lg flex flex-col justify-center min-h-[52px]">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate">Low Prio</span>
          <span className="text-xs font-black text-green-700 mt-0.5">{low}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductivityAnalytics;