import React from "react";
import Link from "next/link";
import Image from "next/image";

export function HiveCard({ hive }: { hive: any }) {
  return (
    <div className="group bg-surface-container-lowest rounded-xl p-1 transition-all hover:translate-y-[-4px] clay-card flex flex-col h-full">
      <div className="relative w-full h-40 mb-2">
        <Image
          alt={`${hive.title} Cover`}
          className="object-cover rounded-t-[1.2rem]"
          src={hive.coverImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">{hive.title}</h3>
        <div className="flex items-center gap-4 mb-6 flex-1">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-lg text-primary">event</span>
            <span className="text-sm font-medium italic">Next Deadline: {hive.nextDeadline}</span>
          </div>
        </div>
        <Link href={`/hive/${hive.id}`} className="w-full py-3 bg-surface-container rounded-full text-on-surface font-semibold group-hover:bg-primary group-hover:text-on-primary transition-all flex items-center justify-center gap-2 border border-outline-variant/20">
          Open Hive
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
