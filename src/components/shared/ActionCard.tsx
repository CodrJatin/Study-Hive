import React from "react";

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onClick?: () => void;
  className?: string;
  type?: "small" | "large";
}

export function ActionCard({
  icon,
  title,
  description,
  actionText,
  onClick,
  className = "",
  type = "small",
}: ActionCardProps) {
  const isLarge = type === "large";

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-center justify-center text-center transition-all ${
        isLarge
          ? "py-20 px-6 bg-surface-container-low rounded-[2rem] clay-inset border-2 border-dashed border-outline-variant/20"
          : "p-8 rounded-[1.5rem] border-2 border-dashed border-outline-variant/30 hover:bg-surface-container-low hover:border-primary/40 cursor-pointer min-h-[300px]"
      } ${className}`}
    >
      <div
        className={`${
          isLarge
            ? "w-20 h-20 rounded-3xl bg-surface-container-highest mb-6 shadow-sm"
            : "w-16 h-16 rounded-full bg-surface-container-high mb-4 group-hover:bg-primary-container"
        } flex items-center justify-center transition-colors`}
      >
        <span
          className={`material-symbols-outlined ${
            isLarge
              ? "text-primary text-4xl"
              : "text-3xl text-outline group-hover:text-primary"
          }`}
        >
          {icon}
        </span>
      </div>
      
      {isLarge ? (
        <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
          {title}
        </h3>
      ) : (
        <h3 className="headline text-lg font-bold text-outline group-hover:text-primary transition-colors">
          {title}
        </h3>
      )}
      
      <p
        className={`text-on-surface-variant ${
          isLarge ? "max-w-sm mb-8 leading-relaxed" : "text-sm text-on-surface-variant/60 max-w-[200px] mt-2"
        }`}
      >
        {description}
      </p>

      {actionText && isLarge && (
        <button className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
          {icon === 'add_circle' || icon === 'add' ? <span className="material-symbols-outlined text-xl">add</span> : null}
          {actionText}
        </button>
      )}

      {actionText && (!isLarge) && (
        <button className="mt-6 text-primary font-bold text-sm hover:underline">
          {actionText}
        </button>
      )}
    </div>
  );
}
