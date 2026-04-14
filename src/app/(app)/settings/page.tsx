import TopBar from "@/components/TopBar";
import { Bell, Moon, Shield, Palette, ChevronRight } from "lucide-react";

const settingsSections = [
  {
    title: "Appearance",
    icon: Palette,
    items: [
      { label: "Theme", description: "Light / Dark", action: "toggle" },
      { label: "Color Accent", description: "Honey #FFC107", action: "color" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Study Reminders", description: "Daily at 18:00", action: "toggle" },
      { label: "Hive Activity", description: "Instant", action: "toggle" },
      { label: "Deadline Alerts", description: "24h before", action: "toggle" },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    items: [
      { label: "Profile Visibility", description: "Hive members only", action: "select" },
      { label: "Progress Sharing", description: "Visible to hive", action: "toggle" },
    ],
  },
  {
    title: "Focus Mode",
    icon: Moon,
    items: [
      { label: "Do Not Disturb", description: "Off", action: "toggle" },
      { label: "Session Block", description: "Enabled", action: "toggle" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Customize your StudyHive experience" />
      <div className="flex-1 p-6 max-w-2xl">
        <div className="flex flex-col gap-4 animate-fade-up">
          {settingsSections.map((section) => (
            <div key={section.title} className="clay-card-flat p-4">
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
                <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {section.title}
                </h3>
              </div>
              <div className="flex flex-col">
                {section.items.map((item, i) => (
                  <div key={item.label}
                    className={`flex items-center justify-between py-3 ${i < section.items.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "var(--color-surface-container)" }}>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: "var(--color-outline-variant)" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
