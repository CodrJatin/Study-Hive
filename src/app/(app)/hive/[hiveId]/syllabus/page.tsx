import React from "react";

export default function SyllabusPage() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header Section */}
      <div className="mb-12">
        <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
          Current Path
        </span>
        <h2 className="text-4xl font-extrabold text-on-background mb-4 tracking-tight">
          Introduction to Digital Curatorial Studies
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span className="text-sm font-medium">Fall 2024</span>
          </div>
          <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">school</span>
            <span className="text-sm font-medium">Dr. Alistair Vance</span>
          </div>
          <div className="w-1 h-1 bg-outline-variant rounded-full hidden md:block"></div>
          <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
            <div className="w-32 h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-primary to-tertiary"></div>
            </div>
            <span className="text-xs font-bold text-primary">34% Complete</span>
          </div>
        </div>
      </div>

      {/* Syllabus Tree */}
      <div className="space-y-6">
        {/* Unit 1 */}
        <div className="group">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer clay-card">
            <span className="material-symbols-outlined text-primary text-2xl transition-transform group-hover:rotate-90">
              expand_more
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="bg-primary-fixed-dim text-on-primary-fixed text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Unit 1
                </span>
                <h3 className="text-lg font-bold text-on-background">Foundations of Curatorial Theory</h3>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                Understanding the shift from physical to digital archives.
              </p>
            </div>
            <div className="text-on-surface-variant/40 hidden md:flex items-center gap-1">
              <span className="material-symbols-outlined">description</span>
              <span className="text-xs font-bold">4 Topics</span>
            </div>
          </div>

          {/* Topic 1.1 */}
          <div className="ml-4 md:ml-12 mt-4 space-y-4 border-l-2 border-surface-container-high pl-4 md:pl-6">
            <div className="relative group/topic">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all clay-card">
                <div className="flex items-center gap-4 flex-1">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl hidden md:block">
                    keyboard_arrow_down
                  </span>
                  <div className="flex-1">
                    <h4 className="font-bold text-on-background">Topic 1.1: Historical Contexts</h4>
                  </div>
                </div>
                <span className="text-xs font-medium text-tertiary px-3 py-1 bg-tertiary/10 rounded-full self-start md:self-auto">
                  In Progress
                </span>
              </div>

              {/* Sub-topics */}
              <div className="ml-2 md:ml-10 mt-3 space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-primary-container bg-surface-container-lowest flex items-center justify-center text-primary cursor-pointer hover:bg-primary-fixed-dim/20">
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    </div>
                    <span className="text-sm text-on-surface-variant font-medium">
                      History of Knowledge Organization
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">link</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-outline-variant bg-surface-container-lowest flex items-center justify-center text-primary cursor-pointer hover:bg-primary-fixed-dim/20"></div>
                    <span className="text-sm text-on-surface-variant font-medium">The Museology Shift</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">article</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded border-2 border-outline-variant bg-surface-container-lowest flex items-center justify-center text-primary cursor-pointer hover:bg-primary-fixed-dim/20"></div>
                    <span className="text-sm text-on-surface-variant font-medium">Core Concepts: Selection &Scarcity</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">play_circle</span>
                </div>
              </div>
            </div>

            {/* Topic 1.2 (Collapsed example) */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-xl bg-surface-container-lowest opacity-70 clay-card">
              <div className="flex items-center gap-4 flex-1">
                <span className="material-symbols-outlined text-on-surface-variant text-xl hidden md:block">
                  keyboard_arrow_right
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-on-background">Topic 1.2: Institutional Standards</h4>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 text-lg self-start md:self-auto">lock</span>
            </div>
          </div>
        </div>

        {/* Unit 2 */}
        <div className="group">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border-l-4 border-transparent hover:border-primary clay-inset">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl transition-transform group-hover:rotate-90">
              expand_more
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="bg-outline-variant/40 text-on-surface-variant text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Unit 2
                </span>
                <h3 className="text-lg font-bold text-on-background">Advanced Studies: The Algorithm as Curator</h3>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                Analyzing machine learning influence on cultural perception.
              </p>
            </div>
            <div className="text-on-surface-variant/40 hidden md:flex items-center gap-1">
              <span className="material-symbols-outlined">science</span>
              <span className="text-xs font-bold">6 Topics</span>
            </div>
          </div>
        </div>

        {/* Unit 3 (Upcoming) */}
        <div className="group opacity-50 grayscale">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-surface-container-low clay-inset">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">lock</span>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="bg-outline-variant/20 text-on-surface-variant/40 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Unit 3
                </span>
                <h3 className="text-lg font-bold text-on-background">Final Thesis &Portfolio</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
