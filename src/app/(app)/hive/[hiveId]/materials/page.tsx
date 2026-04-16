import React from "react";

export default function MaterialsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <header className="mb-10 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-on-background tracking-tight mb-2">
            Curated Materials
          </h1>
          <p className="text-on-surface-variant font-body">
            Manage and organize your academic assets across units and topics.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center bg-surface-container-high px-4 py-2.5 rounded-full flex-grow">
            <span className="material-symbols-outlined text-on-surface-variant mr-2" data-icon="search">
              search
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full font-body outline-none"
              placeholder="Search curated materials..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-surface-container-high text-on-surface px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]" data-icon="filter_list">
                filter_list
              </span>
              Category
            </button>
            <button className="bg-surface-container-high text-on-surface px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]" data-icon="sort">
                sort
              </span>
              Latest
            </button>
            <button className="bg-[#FFC107] text-[#785900] px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm hover:brightness-105 transition-all whitespace-nowrap active:scale-95">
              <span className="material-symbols-outlined text-[18px]" data-icon="add">
                add
              </span>
              Upload
            </button>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="space-y-12">
        {/* Category: General Resources */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight">General Resources</h2>
            <div className="h-[1px] flex-grow bg-surface-container-highest"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Resource Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border-none group clay-card">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary" data-icon="description">
                    description
                  </span>
                </div>
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  PDF
                </span>
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Course Overview &Logistics</h3>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-6">
                Foundational document outlining the semester schedule, grading rubrics, and key contact information.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-widest">
                  1.2 MB
                </span>
                <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                  Open
                  <span className="material-symbols-outlined text-sm" data-icon="open_in_new">
                    open_in_new
                  </span>
                </a>
              </div>
            </div>

            {/* Resource Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low border-none clay-card">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" data-icon="play_circle">
                    play_circle
                  </span>
                </div>
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  LINK
                </span>
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Introductory Seminar Video</h3>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-6">
                Recorded orientation session covering the core philosophy of the &quot;Digital Curator&quot; study method.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-widest">
                  45 MIN
                </span>
                <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                  Watch
                  <span className="material-symbols-outlined text-sm" data-icon="play_arrow">
                    play_arrow
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Category: Unit 01: Theoretical Frameworks */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4 flex-grow">
              <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight w-full md:w-auto">
                Unit 01: Theoretical Frameworks
              </h2>
              <div className="h-[1px] flex-grow bg-surface-container-highest hidden md:block"></div>
            </div>
            <button className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0">
              <span className="material-symbols-outlined text-[18px]" data-icon="download">
                download
              </span>
              Download Unit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regular Cards for Unit 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low clay-card">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" data-icon="analytics">
                    analytics
                  </span>
                </div>
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  XLSX
                </span>
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Data Correlation Matrix</h3>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-6">
                Interactive spreadsheet for tracking variables across the five core case studies discussed in Unit 1.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-widest">
                  850 KB
                </span>
                <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                  Open Matrix
                  <span className="material-symbols-outlined text-sm" data-icon="open_in_new">
                    open_in_new
                  </span>
                </a>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 transition-all hover:bg-surface-container-low clay-card">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary" data-icon="edit_note">
                    edit_note
                  </span>
                </div>
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  DOCX
                </span>
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Synthesis Writing Guide</h3>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed mb-6">
                A step-by-step guide on how to integrate Unit 1 theories into a cohesive academic argument.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-label font-semibold text-on-surface-variant uppercase tracking-widest">
                  2.1 MB
                </span>
                <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline" href="#">
                  Read Guide
                  <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Category: Topic 1.2: Cognitive Ergonomics */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight">
              Topic 1.2: Cognitive Ergonomics
            </h2>
            <div className="h-[1px] flex-grow bg-surface-container-highest"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Compact Cards */}
            <div className="bg-surface-container-lowest rounded-xl p-5 hover:bg-primary-container/10 transition-all cursor-pointer group clay-card">
              <span className="material-symbols-outlined text-primary mb-3 block" data-icon="image">
                image
              </span>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">
                Neural Pathways Diagram
              </h4>
              <p className="text-[11px] text-on-surface-variant font-body">Visual aid for cognitive load theory.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 hover:bg-primary-container/10 transition-all cursor-pointer group clay-card">
              <span className="material-symbols-outlined text-primary mb-3 block" data-icon="article">
                article
              </span>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">
                Study Design Principles
              </h4>
              <p className="text-[11px] text-on-surface-variant font-body">Drafting guidelines for experiments.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 hover:bg-primary-container/10 transition-all cursor-pointer group clay-card">
              <span className="material-symbols-outlined text-primary mb-3 block" data-icon="audio_file">
                audio_file
              </span>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">
                Professor&apos;s Audio Notes
              </h4>
              <p className="text-[11px] text-on-surface-variant font-body">Deep dive into memory systems.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-5 hover:bg-primary-container/10 transition-all cursor-pointer group clay-card">
              <span className="material-symbols-outlined text-primary mb-3 block" data-icon="library_books">
                library_books
              </span>
              <h4 className="font-headline font-bold text-sm text-on-surface mb-1 group-hover:text-primary transition-colors">
                Reference Bibliography
              </h4>
              <p className="text-[11px] text-on-surface-variant font-body">All citations for Topic 1.2.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
