import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-60 flex flex-col">
        {children}
      </main>
    </div>
  );
}
