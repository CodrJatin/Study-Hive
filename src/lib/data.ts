export const syllabusUnits = [
  {
    id: "unit-1",
    title: "Foundations of Curatorial Theory",
    description: "Understanding the shift from physical to digital archives.",
    topicsCount: 4,
    topics: [
      {
        id: "topic-1-1",
        title: "Historical Contexts",
        status: "In Progress",
        subtopics: [
          { id: "sub-1-1-1", title: "History of Knowledge Organization", type: "check", url: "#", completed: true },
          { id: "sub-1-1-2", title: "The Museology Shift", type: "article", url: "#", completed: false },
          { id: "sub-1-1-3", title: "Core Concepts: Selection & Scarcity", type: "play_circle", url: "#", completed: false }
        ]
      },
      {
        id: "topic-1-2",
        title: "Institutional Standards",
        status: "",
        subtopics: []
      }
    ]
  },
  {
    id: "unit-2",
    title: "Advanced Studies: The Algorithm as Curator",
    description: "Analyzing machine learning influence on cultural perception.",
    topicsCount: 6,
    topics: []
  },
  {
    id: "unit-3",
    title: "Final Thesis & Portfolio",
    description: "Capstone project.",
    topicsCount: 2,
    topics: []
  }
];

export const materialsData = [
  {
    id: "mat-1",
    title: "Course Overview & Logistics",
    description: "Foundational document outlining the semester schedule, grading rubrics, and key contact information.",
    type: "PDF",
    icon: "description",
    iconBg: "bg-tertiary-container/30",
    iconColor: "text-tertiary",
    size: "1.2 MB",
    linkTitle: "Open",
    category: "General Resources",
  },
  {
    id: "mat-2",
    title: "Introductory Seminar Video",
    description: "Recorded orientation session covering the core philosophy of the 'Digital Curator' study method.",
    type: "LINK",
    icon: "play_circle",
    iconBg: "bg-primary-container/30",
    iconColor: "text-primary",
    size: "45 MIN",
    linkTitle: "Watch",
    category: "General Resources",
  },
  {
    id: "mat-3",
    title: "Data Correlation Matrix",
    description: "Interactive spreadsheet for tracking variables across the five core case studies discussed in Unit 1.",
    type: "XLSX",
    icon: "analytics",
    iconBg: "bg-primary-container/30",
    iconColor: "text-primary",
    size: "850 KB",
    linkTitle: "Open Matrix",
    category: "Unit 01: Theoretical Frameworks",
  },
  {
    id: "mat-4",
    title: "Synthesis Writing Guide",
    description: "A step-by-step guide on how to integrate Unit 1 theories into a cohesive academic argument.",
    type: "DOCX",
    icon: "edit_note",
    iconBg: "bg-tertiary-container/30",
    iconColor: "text-tertiary",
    size: "2.1 MB",
    linkTitle: "Read Guide",
    category: "Unit 01: Theoretical Frameworks",
  }
];

export const tracksData = [
  {
    id: "1",
    title: "Mid-sem Prep",
    creator: "Created by Jatin",
    statusBadge: "Priority",
    statusColor: "tertiary",
    icon: "auto_stories",
    progress: 65,
    materialsCount: 12,
    daysLeft: 4,
    colorScheme: "primary",
  },
  {
    id: "2",
    title: "Neuroscience Core",
    creator: "Created by Sarah M.",
    statusBadge: "Ongoing",
    statusColor: "secondary",
    icon: "science",
    progress: 20,
    materialsCount: 28,
    daysLeft: 15,
    colorScheme: "secondary",
  }
];

export const announcementsData = [
  {
    id: "ann-1",
    title: "Lab Session Schedule Change",
    timeAgo: "2h ago",
    content: "The Tuesday lab session for Unit 4: Spectroscopic Analysis has been moved to Thursday at 3:00 PM due to equipment maintenance.",
    authorInitials: "J",
    authorName: "By Jatin"
  },
  {
    id: "ann-2",
    title: "Mid-sem Track Now Live",
    timeAgo: "5h ago",
    content: "I've created a focused track for the upcoming mid-semester examinations. It covers the first three chapters.",
    authorInitials: "J",
    authorName: "By Jatin"
  }
];

export const deadlinesData = [
  {
    id: "dead-1",
    title: "Stereochemistry Assignment",
    dueDate: "Due Tomorrow",
    dueColor: "error",
    dateBadge: "24 Oct",
    indicatorColor: "bg-error"
  },
  {
    id: "dead-2",
    title: "Quiz: Reaction Mechanisms",
    dueDate: "Next Week",
    dueColor: "on-surface/40",
    dateBadge: "27 Oct",
    indicatorColor: "bg-outline-variant"
  }
];

export const activitiesData = [
  {
    id: "act-1",
    icon: "upload_file",
    actionStart: "uploaded material in",
    targetDesc: "Unit 3: Functional Groups",
    targetColor: "text-primary font-semibold",
    timeAgo: "Just now",
    author: "Jatin",
    bgColor: "bg-primary-container",
    iconColor: "text-on-primary-container",
  },
  {
    id: "act-2",
    icon: "play_circle",
    actionStart: "started track",
    targetDesc: "Mid-sem Revision",
    targetColor: "text-secondary font-semibold",
    timeAgo: "45 mins ago",
    author: "Jatin",
    bgColor: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
  },
  {
    id: "act-3",
    icon: "person_add",
    actionStart: "joined the Hive",
    targetDesc: "",
    targetColor: "",
    timeAgo: "1 hour ago",
    author: "Sarah",
    bgColor: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-container",
  }
];

export const dashboardHivesData = [
  {
    id: "1",
    title: "Organic Chemistry",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH7yuAIen1r4BpcesmDTJojh_DXbDoQNmESieU8vHC22SzE6sSQ8mlit_3436qqDOCTPyVLw3-7KZZaux-tn7PUeRGx228t7Jfwpz3kAfq-u7Cn8QomrCMVuR8TDzdiQ1taxMzYjGfU5IpXtNrEZRdS63uM5qCTq03V1YMOHCfz1r5id9I-d-pkxUqN8rWb3YBk8tfcYxx4eKrBd94cjOWZygnpadhtCb7R_JuhpeVs2e6RD9vf5UONlFHKbWELsfdTctVMU3rdQ",
    nextDeadline: "Oct 24",
  },
  {
    id: "2",
    title: "Intro to Algorithms",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpkJ1giiUNzbZ_Jy_FPwk_QJOSE-aFZJntW27PgNmAwfOmMEGupUOycbjguMXkOsgZSybXMG2GB9JVorPzucmylGoviJhuHbWF91rnlG3vYZwfSVXkxaLJL2fPJx9AN4gROfch5UdhasrhYD36da7BJc4oBdmSmpYrH1rFSXfu4Amw5B0fI_CTOBuThgUNSICgOXhSaWxt5t7RzHbkd1wlD7rGIaJ1zcGAxp0oPanWmgFw2O6q0jER8oIcPTuRq2RLUkUwSPO9cg",
    nextDeadline: "Oct 26",
  },
  {
    id: "3",
    title: "World History",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrz6Wox9oOYml3awNLz41F0cJT6y2vyjmyTpdRukuenoqmpfiwHA7gODUKk1xxPz9edNELfgX47zBbHgs5gGXYCCkQfSYP8W44uo9NARoIE0gia2T50MDOtIMxMZg2ODINcNuPfkZg-cwRjMsKcw2-XKtVEafJF1cTPlGEnD3iUUkKhhb22OhOZHG1EN_GH5QpXhmZID42IuNen1Pme_iYcDAroZN0ebUWQek3YEZ_vq1JFKtfH6Jg2M110C6SA305J4BDepr2pQ",
    nextDeadline: "Oct 28",
  }
];

export const trackMaterialsData = [
  {
    id: '1',
    title: 'Unit 1: Foundations of Molecular Orbitals',
    type: 'PDF',
    details: '12MB',
    instructions: '"Read pages 1 - 12 then 35 to 45. Focus on the hybridization diagrams."',
    completed: true
  },
  {
    id: '2',
    title: 'Reaction Mechanisms Overview',
    type: 'Video',
    details: '15:00 mins',
    instructions: '"Watch the first 15 minutes. Pay close attention to nucleophilic attack sequences."',
    completed: false
  },
  {
    id: '3',
    title: 'Practice Set: Alkanes & Alkenes',
    type: 'Doc',
    details: 'Assignment',
    instructions: '"Complete problems 1-10 on page 4. Show all electron pushing arrows."',
    completed: false
  }
];