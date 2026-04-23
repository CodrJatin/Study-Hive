import Link from "next/link";

interface HiveCardProps {
  hive: {
    id: string;
    title: string;
    description: string;
    nextDeadline: string;
    daysLeft: number | null;
  };
}

export function HiveCard({ hive }: HiveCardProps) {
  return (
    <div className="relative group h-full">
      <Link href={`/hive/${hive.id}`} className="block h-full group">
        <div className="bg-surface-container-lowest rounded-[24px] p-7 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-outline-variant/10 h-full flex flex-col">
          {/* Top Header: Icon & Badge */}
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary text-[24px]">
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
            <h3 className="text-[20px] font-bold text-on-background leading-tight mb-2 group-hover:text-primary transition-colors">
              {hive.title}
            </h3>
            <p className="text-[13px] text-on-surface-variant leading-relaxed mb-8 line-clamp-3 font-medium">
              {hive.description}
            </p>
          </div>
        </div>
      </Link>

      {/* Materials Quick Link */}
      <Link 
        href={`/hive/${hive.id}/materials`}
        className="absolute bottom-6 right-6 w-10 h-10 bg-primary/5 hover:bg-primary text-primary hover:text-on-primary rounded-xl flex items-center justify-center transition-all duration-200 border border-primary/10"
        title="View Materials"
      >
        <span className="material-symbols-outlined text-[20px]">
          folder_open
        </span>
      </Link>
    </div>
  );
}
