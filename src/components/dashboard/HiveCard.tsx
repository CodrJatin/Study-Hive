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
      <div className="bg-white rounded-[24px] p-7 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-[#E5E5E5] h-full flex flex-col">
        {/* Top Header: Icon & Badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 bg-[#F6F4F0] rounded-xl flex items-center justify-center shrink-0 border border-[#E5E5E5]">
            <span className="material-symbols-outlined text-[#735A27] text-[24px]">
              science
            </span>
          </div>

          {hive.daysLeft !== null && (
            <div className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide ${
              hive.daysLeft <= 3 
                ? "bg-[#F7EAD7] text-[#8F5B1A]" // e.g. "Midterm Soon" coloring from mock
                : "bg-surface-container-high text-on-surface-variant"
            }`}>
              {hive.daysLeft === 0 ? "Due Today" : `Due in ${hive.daysLeft} days`}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-[20px] font-bold text-[#1A1A1A] leading-tight mb-2 group-hover:text-primary transition-colors">
            {hive.title}
          </h3>
          <p className="text-[13px] text-[#757575] leading-relaxed mb-8 line-clamp-3 font-medium">
            {hive.description}
          </p>
        </div>

        {/* Footer: Progress */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-3 text-[12px] font-bold">
            <span className="text-[#757575]">Syllabus Progress</span>
            <span className="text-[#4A4A4A]">{hive.progress}%</span>
          </div>
          <div className="h-2 w-full bg-[#E5E5E5] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-700 ease-out ${
                hive.progress > 50 ? "bg-[#735A27]" : "bg-[#007A8A]"
              }`} 
              style={{ width: `${hive.progress}%` }} 
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
