interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  height?: "sm" | "md" | "lg";
}

const heights = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

export default function ProgressBar({ value, className = "", height = "md" }: ProgressBarProps) {
  return (
    <div className={`progress-track w-full ${heights[height]} ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="progress-fill h-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
