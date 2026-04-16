import React from "react";
import { MaterialTile } from "@/components/track/MaterialTile";

export default function TrackDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-2 gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Mid-sem Prep</h1>
          <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest self-start md:self-auto">
            In Progress
          </span>
        </div>
        <p className="text-stone-500 mb-8 max-w-2xl leading-relaxed">
          A curated study track designed to cover core reaction mechanisms and orbital theory ahead of the mid-semester
          examination.
        </p>

        {/* Overall Progress */}
        <div className="bg-surface-container-low p-6 rounded-[2rem] clay-inset border-none">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-tighter">Your Journey</p>
              <p className="text-lg font-bold text-on-surface">33% Completed</p>
            </div>
            <p className="text-sm font-medium text-stone-500">1 of 3 tasks done</p>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-tertiary w-1/3 rounded-full transition-all duration-500"></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold text-on-surface-variant px-1">Active Curriculum</h2>

        <MaterialTile material={{
          id: '1',
          title: 'Unit 1: Foundations of Molecular Orbitals',
          type: 'PDF',
          details: '12MB',
          instructions: '"Read pages 1 - 12 then 35 to 45. Focus on the hybridization diagrams."',
          completed: true
        }} />

        <MaterialTile material={{
          id: '2',
          title: 'Reaction Mechanisms Overview',
          type: 'Video',
          details: '15:00 mins',
          instructions: '"Watch the first 15 minutes. Pay close attention to nucleophilic attack sequences."',
          completed: false
        }} />

        <MaterialTile material={{
          id: '3',
          title: 'Practice Set: Alkanes & Alkenes',
          type: 'Doc',
          details: 'Assignment',
          instructions: '"Complete problems 1-10 on page 4. Show all electron pushing arrows."',
          completed: false
        }} />
      </div>

      {/* Bento Style Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="col-span-1 bg-tertiary-container/10 p-6 rounded-2xl border border-tertiary/10 flex flex-col justify-center">
          <span className="material-symbols-outlined text-tertiary mb-4">timer</span>
          <p className="text-xs font-bold text-tertiary uppercase tracking-widest">Est. Time Remaining</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">4.5 Hours</p>
        </div>
        <div className="col-span-1 bg-primary-container/10 p-6 rounded-2xl border border-primary/10 flex flex-col justify-center">
          <span className="material-symbols-outlined text-primary mb-4">groups</span>
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Peers Active</p>
          <p className="text-2xl font-extrabold text-on-surface mt-1">12 Students</p>
        </div>
        <div className="col-span-1 bg-surface-container-low p-6 rounded-2xl clay-inset border-none">
          <div className="flex -space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9xsX-XRlbszSkqk4Qjzr9xGLQhUnrmb3juPZTSnM-X2ApMgPOt2_agUmnCe8fIFqNkfDud93JRqHzuMDLskBKWnIyoWaq7Kws-p7cVRW-Fk3dy3SFTFU_4wJYOgQZcGcSTvV7pQqbODqjYhIAu73y9EzzKT005c3YhMeSTT27S4vumAmchJx1xcArAFyJgtsklnNddk5b_NwmdAiTo11iwNhNzFXZiCrYNE61UG1x136MgtYwrBH55lKKS9Rppkn8HtYOYMf2AQ" alt="Peer" className="w-full h-full object-cover"/>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUDtMwNahU4dlByk07iZ-kSUTVN2a9nk2Yh5qwa_phKiXijDsgpbKhzR1ET6a3W6LjoAu69GCO4nl-mhCIQfWQTJgvQZrAWLRmGdhca3IfEv_LxTYIT7wLptRJKtHj5umXFidrHe2RiEyLzPJbgVvGatmjReLqESnipJST6QnhJefKS9Yw3A5xuQrokqaIoyNjBbUjmjCizUZUHu_rbEXuKKSNPm9jv2YZHiF8hmMuxiCzNtsCxPyUThfOVBHRdl3M6d6LjZyZMA" alt="Peer" className="w-full h-full object-cover"/>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-300 overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQW0ZDzd8c6_kYZBCYBGRJtlXikKkxBksbX_z-oaDab7i7SS6ctq9OWjoae_DAdjwl97VaHx05ypWZFfk0P6kic_EPEwqK2TQDjx_mtfaeFV3Z7wTLd94YYdr9I2NcA5IL-bzndGe82fqZHyS7CtYwoK9-Nu5JLqfF9_CyHG2-JVIVThmxR4J2_bcdrApfIRky8HSwcRFSjF4afHacd8qHJJWNkFNZ1oiNsjxsCrE3cnhaIL085HXPUsnueai4f75AcYM9nGTd7Q" alt="Peer" className="w-full h-full object-cover"/>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[10px] font-bold text-stone-500">
              +9
            </div>
          </div>
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Join Study Session</p>
          <button className="mt-2 text-sm font-bold text-primary hover:underline transition-all">Enter Room &rarr;</button>
        </div>
      </div>
    </div>
  );
}
