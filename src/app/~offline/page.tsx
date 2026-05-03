"use client";
import { Icon } from "@/components/ui/Icon";
export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{ background: "linear-gradient(135deg, #785900 0%, #ffc107 100%)" }}
        >
          <Icon name="wifi_off" className="text-5xl text-white select-none" />
        </div>
        {/* Pulse ring */}
        <div
          className="absolute inset-0 rounded-3xl animate-ping opacity-20"
          style={{ background: "linear-gradient(135deg, #785900 0%, #ffc107 100%)" }}
        />
      </div>

      {/* Heading */}
      <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
        You&apos;re Offline
      </h1>
      <p className="text-on-surface-variant font-body text-base max-w-xs leading-relaxed">
        It looks like you&apos;ve lost your connection. StudyHive needs the internet to
        sync your hive — but cached content may still be available.
      </p>

      {/* Divider */}
      <div className="my-8 flex items-center gap-4 w-full max-w-xs">
        <div className="flex-1 h-px bg-outline-variant/30" />
        <Icon name="hive" className="text-outline text-sm" />
        <div className="flex-1 h-px bg-outline-variant/30" />
      </div>

      {/* Tips */}
      <div className="w-full max-w-xs space-y-3 mb-10">
        {[
          { icon: "history", text: "Previously visited pages may load from cache." },
          { icon: "signal_wifi_statusbar_connected_no_internet_4", text: "Check your Wi-Fi or mobile data." },
          { icon: "refresh", text: "Try reloading once you're back online." },
        ].map(({ icon, text }) => (
          <div
            key={icon}
            className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-lowest clay-card text-left"
          >
            <Icon name={icon} className="text-primary text-xl mt-0.5 shrink-0" />
            <p className="text-on-surface-variant text-sm font-body">{text}</p>
          </div>
        ))}
      </div>

      {/* Retry button */}
      <button
        onClick={() => window.location.reload()}
        className="cta-gradient text-on-primary font-headline font-bold px-8 py-4 rounded-full shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
      >
        <Icon name="refresh" className="text-xl" />
        Try Again
      </button>

      {/* Branding footer */}
      <p className="mt-10 text-on-surface-variant/40 text-xs font-body">
        StudyHive — The Academic Atelier
      </p>
    </div>
  );
}
