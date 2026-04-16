import React from "react";
import { materialsData } from "@/lib/data";
import { MaterialCard } from "@/components/materials/MaterialCard";

export default function MaterialsPage() {
  // Group materials by category for better display
  const groupedMaterials = materialsData.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
  }, {} as Record<string, typeof materialsData>);

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
        {Object.entries(groupedMaterials).map(([category, items]) => (
          <section key={category}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-grow">
                <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight w-full md:w-auto">
                  {category}
                </h2>
                <div className="h-[1px] flex-grow bg-surface-container-highest hidden md:block"></div>
              </div>
              {category.includes('Unit') && (
                <button className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 shrink-0">
                  <span className="material-symbols-outlined text-[18px]" data-icon="download">
                    download
                  </span>
                  Download Unit
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(material => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
