import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
      {/* Welcome Hero (Editorial Pattern) */}
      <section className="mb-12 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-background mb-4">
            Good morning, <span className="text-primary">Alex</span>.
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-low px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
            <span className="text-sm font-semibold">12 Day Streak</span>
          </div>
        </div>
      </section>

      {/* Bento Grid for Hive Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Hive Card: Organic Chemistry */}
        <div className="group bg-surface-container-lowest rounded-xl p-1 transition-all hover:translate-y-[-4px] clay-card">
          <img
            alt="Organic Chemistry Cover"
            className="w-full h-40 object-cover rounded-t-[1.2rem] mb-2"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH7yuAIen1r4BpcesmDTJojh_DXbDoQNmESieU8vHC22SzE6sSQ8mlit_3436qqDOCTPyVLw3-7KZZaux-tn7PUeRGx228t7Jfwpz3kAfq-u7Cn8QomrCMVuR8TDzdiQ1taxMzYjGfU5IpXtNrEZRdS63uM5qCTq03V1YMOHCfz1r5id9I-d-pkxUqN8rWb3YBk8tfcYxx4eKrBd94cjOWZygnpadhtCb7R_JuhpeVs2e6RD9vf5UONlFHKbWELsfdTctVMU3rdQ"
          />
          <div className="p-6">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Organic Chemistry</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg text-primary">event</span>
                <span className="text-sm font-medium italic">Next Deadline: Oct 24</span>
              </div>
            </div>
            <Link href="/hive/1" className="w-full py-3 bg-surface-container rounded-full text-on-surface font-semibold group-hover:bg-primary group-hover:text-on-primary transition-all flex items-center justify-center gap-2 border border-outline-variant/20">
              Open Hive
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Hive Card: Intro to Algorithms */}
        <div className="group bg-surface-container-lowest rounded-xl p-1 transition-all hover:translate-y-[-4px] clay-card">
          <img
            alt="Intro to Algorithms Cover"
            className="w-full h-40 object-cover rounded-t-[1.2rem] mb-2"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpkJ1giiUNzbZ_Jy_FPwk_QJOSE-aFZJntW27PgNmAwfOmMEGupUOycbjguMXkOsgZSybXMG2GB9JVorPzucmylGoviJhuHbWF91rnlG3vYZwfSVXkxaLJL2fPJx9AN4gROfch5UdhasrhYD36da7BJc4oBdmSmpYrH1rFSXfu4Amw5B0fI_CTOBuThgUNSICgOXhSaWxt5t7RzHbkd1wlD7rGIaJ1zcGAxp0oPanWmgFw2O6q0jER8oIcPTuRq2RLUkUwSPO9cg"
          />
          <div className="p-6">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Intro to Algorithms</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg text-primary">event</span>
                <span className="text-sm font-medium italic">Next Deadline: Oct 26</span>
              </div>
            </div>
            <Link href="/hive/2" className="w-full py-3 bg-surface-container rounded-full text-on-surface font-semibold group-hover:bg-primary group-hover:text-on-primary transition-all flex items-center justify-center gap-2 border border-outline-variant/20">
              Open Hive
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Hive Card: World History */}
        <div className="group bg-surface-container-lowest rounded-xl p-1 transition-all hover:translate-y-[-4px] clay-card">
          <img
            alt="World History Cover"
            className="w-full h-40 object-cover rounded-t-[1.2rem] mb-2"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrz6Wox9oOYml3awNLz41F0cJT6y2vyjmyTpdRukuenoqmpfiwHA7gODUKk1xxPz9edNELfgX47zBbHgs5gGXYCCkQfSYP8W44uo9NARoIE0gia2T50MDOtIMxMZg2ODINcNuPfkZg-cwRjMsKcw2-XKtVEafJF1cTPlGEnD3iUUkKhhb22OhOZHG1EN_GH5QpXhmZID42IuNen1Pme_iYcDAroZN0ebUWQek3YEZ_vq1JFKtfH6Jg2M110C6SA305J4BDepr2pQ"
          />
          <div className="p-6">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">World History</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg text-primary">event</span>
                <span className="text-sm font-medium italic">Next Deadline: Oct 28</span>
              </div>
            </div>
            <Link href="/hive/3" className="w-full py-3 bg-surface-container rounded-full text-on-surface font-semibold group-hover:bg-primary group-hover:text-on-primary transition-all flex items-center justify-center gap-2 border border-outline-variant/20">
              Open Hive
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Add New Hive Card (Asymmetric Layout Element) */}
        <div className="group border-2 border-dashed border-outline-variant/30 rounded-[1.5rem] flex flex-col items-center justify-center p-8 transition-all hover:bg-surface-container-low hover:border-primary/40 cursor-pointer h-full min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
            <span className="material-symbols-outlined text-3xl text-primary">add_circle</span>
          </div>
          <p className="text-on-surface-variant font-headline font-bold">Create New Hive</p>
          <p className="text-xs text-on-surface-variant/60 text-center mt-2 px-4">Start a collaborative studio for your latest course</p>
        </div>
      </section>

      {/* Activity Feed (Glassmorphism Sidebar for Desktop) */}
      <section className="mt-16 bg-surface-container-low rounded-xl p-8 relative overflow-hidden clay-inset">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-headline font-extrabold text-on-surface">Recent Curations</h2>
          <button className="text-sm font-semibold text-primary flex items-center gap-1">
            View Archive
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl clay-card">
            <div className="w-12 h-12 rounded-lg bg-tertiary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">description</span>
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-on-surface">Photosynthesis_Flowchart.pdf</p>
              <p className="text-xs text-on-surface-variant">Shared in Biology 101 • 2h ago</p>
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </button>
          </div>
          <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl clay-card">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">forum</span>
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-on-surface">Marcus joined the Algorithms Hive</p>
              <p className="text-xs text-on-surface-variant">Invite accepted via link • 4h ago</p>
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
