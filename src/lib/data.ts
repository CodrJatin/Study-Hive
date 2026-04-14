// ── Types ────────────────────────────────────────────────────────────────────

export interface Track {
  id: string;
  name: string;
  subject: string;
  tag: string;
  progress: number;
  color: "primary" | "secondary" | "tertiary";
  updatedAt: string;
}

export interface SyllabusUnit {
  id: string;
  title: string;
  topics: SyllabusTopic[];
  progress: number;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "not-started";
  duration?: string;
  resources?: number;
}

export interface HiveMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: "admin" | "member";
  progress: number;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

export const tracks: Track[] = [
  {
    id: "t1",
    name: "Molecular Genetics",
    subject: "Biology HL",
    tag: "Track Alpha",
    progress: 68,
    color: "primary",
    updatedAt: "2 hours ago",
  },
  {
    id: "t2",
    name: "Advanced Calculus",
    subject: "Mathematics",
    tag: "Pure Track",
    progress: 42,
    color: "secondary",
    updatedAt: "Yesterday",
  },
  {
    id: "t3",
    name: "Modern History",
    subject: "Social Sciences",
    tag: "Revision",
    progress: 85,
    color: "tertiary",
    updatedAt: "3 days ago",
  },
];

export const syllabusUnits: SyllabusUnit[] = [
  {
    id: "u1",
    title: "The Molecular Base of Life",
    progress: 80,
    topics: [
      { id: "t1", title: "Chemical Bonds and Interactions", status: "completed", duration: "2h 30m", resources: 4 },
      { id: "t2", title: "Carbon and Molecular Diversity", status: "completed", duration: "1h 45m", resources: 3 },
      { id: "t3", title: "Macromolecules in Organisms", status: "in-progress", duration: "2h 15m", resources: 5 },
      { id: "t4", title: "Nucleic Acids & Information Flow", status: "not-started", duration: "3h", resources: 6 },
    ],
  },
  {
    id: "u2",
    title: "Cell Structure & Function",
    progress: 55,
    topics: [
      { id: "t5", title: "The Evolutionary Origin of Cells", status: "completed", duration: "2h", resources: 3 },
      { id: "t6", title: "Prokaryotic vs Eukaryotic Cells", status: "in-progress", duration: "2h 30m", resources: 4 },
      { id: "t7", title: "Membrane Structure & Function", status: "not-started", duration: "3h", resources: 5 },
    ],
  },
  {
    id: "u3",
    title: "Metabolism & Energy",
    progress: 20,
    topics: [
      { id: "t8", title: "Enzymes and Metabolic Pathways", status: "in-progress", duration: "2h 45m", resources: 5 },
      { id: "t9", title: "Cellular Respiration", status: "not-started", duration: "4h", resources: 7 },
      { id: "t10", title: "Photosynthesis", status: "not-started", duration: "4h", resources: 6 },
    ],
  },
  {
    id: "u4",
    title: "Molecular Basis of Inheritance",
    progress: 0,
    topics: [
      { id: "t11", title: "DNA Replication", status: "not-started", duration: "3h", resources: 5 },
      { id: "t12", title: "Gene Expression", status: "not-started", duration: "3h 30m", resources: 6 },
      { id: "t13", title: "Biotechnology & Genomics", status: "not-started", duration: "4h", resources: 8 },
    ],
  },
];

export const hiveMembers: HiveMember[] = [
  { id: "m1", name: "Alex Chen", initials: "AC", color: "#fdc003", role: "admin", progress: 72 },
  { id: "m2", name: "Priya Shah", initials: "PS", color: "#b3d4ff", role: "member", progress: 58 },
  { id: "m3", name: "Marcus Lee", initials: "ML", color: "#f288ff", role: "member", progress: 45 },
  { id: "m4", name: "Zoe Kim", initials: "ZK", color: "#fdc003", role: "member", progress: 91 },
  { id: "m5", name: "Jordan Osei", initials: "JO", color: "#b3d4ff", role: "member", progress: 33 },
];

export const activeTracks = [
  {
    id: "at1",
    name: "Final Board Review",
    description: "Mastering the complete Biology core syllabus for finals.",
    units: 4,
    topics: 18,
    daysLeft: 12,
    progress: 64,
  },
  {
    id: "at2",
    name: "Mid-Sems Prep",
    description: "Focused sprint covering Units 1–3 before mid-semester exams.",
    units: 3,
    topics: 10,
    daysLeft: 5,
    progress: 38,
  },
];
