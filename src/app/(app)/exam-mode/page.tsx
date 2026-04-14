import TopBar from "@/components/TopBar";
import { Timer, Zap, Brain, Trophy } from "lucide-react";

export default function ExamModePage() {
  return (
    <>
      <TopBar title="Exam Mode" subtitle="Focused exam preparation sessions" />
      <div className="flex-1 p-6">
        <div className="clay-card p-8 text-center max-w-lg mx-auto mt-8 animate-scale-in">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--color-primary-container)" }}>
            <Timer className="w-8 h-8" style={{ color: "var(--color-on-primary-container)" }} />
          </div>
          <h2 className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Exam Mode
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--color-on-surface-variant)" }}>
            Lock in. Choose a track and run a timed exam simulation with AI-generated questions.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Timer, label: "Timed Mock" },
              { icon: Brain, label: "AI Quiz" },
              { icon: Zap, label: "Sprint Mode" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="clay-card-flat p-3 flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" style={{ color: "var(--color-secondary)" }} />
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
          <button id="exam-start" className="btn-primary w-full justify-center">
            <Trophy className="w-4 h-4" /> Start Exam Session
          </button>
        </div>
      </div>
    </>
  );
}
