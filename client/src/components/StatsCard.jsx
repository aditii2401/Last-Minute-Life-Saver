function StatsCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white border border-slate-200/70 p-4 rounded-xl flex flex-col justify-center min-h-[105px] shadow-sm transition-all hover:border-slate-300">
      <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
        {title}
      </span>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className={`text-2xl font-black tracking-tight ${color || "text-slate-800"}`}>
          {value}
        </span>
        <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
          / {subtitle}
        </span>
      </div>
    </div>
  );
}

export default StatsCard;