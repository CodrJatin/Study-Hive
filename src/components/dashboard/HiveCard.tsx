import Link from "next/link";

interface HiveCardProps {
  hive: {
    id: string;
    title: string;
    description: string;
    nextDeadline: string;
    progress: number;
    daysLeft: number | null;
  };
}

export function HiveCard({ hive }: HiveCardProps) {
  return (
    <Link href={`/hive/${hive.id}`} className="block h-full group">
      <div className="bg-surface-container-lowest rounded-[24px] p-7 transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] clay-card border border-outline-variant/10 h-full flex flex-col">
        {/* Top: Icon box */}
        <div className="w-14 h-14 bg-[#F7F2ED] rounded-xl flex items-center justify-center mb-6 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-300">
          <span className="material-symbols-outlined text-[#735A27] text-[28px]">
            science
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-[22px] font-bold text-[#1A1A1A] leading-tight mb-2 group-hover:text-primary transition-colors">
            {hive.title}
          </h3>
          <p className="text-[14px] text-[#757575] leading-relaxed mb-8 line-clamp-3 font-medium">
            {hive.description}
          </p>
        </div>

        {/* Footer: Progress */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-bold text-[#757575] tracking-tight">Syllabus Progress</span>
            <span className="text-[13px] font-bold text-[#4A4A4A]">{hive.progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-[#E5E5E5] rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-[#735A27] transition-all duration-700 ease-out" 
              style={{ width: `${hive.progress}%` }} 
            />
          </div>
        </div>

        {/* Persistent deadline indicator */}
        <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-4">
           <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-[18px] text-primary/60">event</span>
             <span className="text-[12px] font-bold text-on-surface-variant/70 uppercase tracking-wider">
               {hive.nextDeadline === "No deadlines" ? "No Deadlines" : `Due: ${hive.nextDeadline}`}
             </span>
           </div>
           
           {hive.daysLeft !== null && (
             <span className={`text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
               hive.daysLeft === 0 
                ? "bg-error/10 text-error animate-pulse" 
                : "bg-surface-container-high text-on-surface-variant/60"
             }`}>
               {hive.daysLeft === 0 ? "Today" : `${hive.daysLeft} days left`}
             </span>
           )}
        </div>
      </div>
    </Link>
  );
}
