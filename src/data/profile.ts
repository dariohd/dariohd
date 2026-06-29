export interface Skill {
  name: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'languages' | 'game' | 'creative' | 'tools' | 'network';
}

export interface Experience {
  company: string;
  period: string;
  role: string;
  highlights: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  highlights: string[];
}

export interface Language {
  name: string;
  level: string;
}

export const profile = {
  /** Nom civil — CV, contact (portfolio classique hugodavion). */
  name: 'Hugo Davion',
  /** Identité publique de ce portfolio interactif. */
  brand: 'dariohd',
  alias: 'DHD',
  handle: 'dariohd',
  title: 'Développeur full stack · alternance CGI',
  tagline: 'Web, PWA, réseaux et expériences interactives, du pixel au WebGL.',
  location: 'France',
  age: 22,
  bio: [
    'Développeur full stack, web et technicien réseaux. En alternance chez CGI (front-end TypeScript, back-end Java Spring, PostgreSQL) et en cycle ingénieur RIOC à UniLaSalle Amiens.',
    'En parallèle, je conçois des sites vitrines, PWA métier et petits jeux en indépendant sous la marque dariohd.',
    'Rigoureux, autonome et à l\'aise autant en équipe qu\'en environnement technique varié.',
  ],
  links: {
    email: 'davionhugo@gmail.com',
    phone: '06 13 80 95 65',
    github: 'https://github.com/dariohd',
    linkedin: 'https://www.linkedin.com/in/hugodavion',
    portfolio: 'https://hugodavion.vercel.app/',
  },
  services: [
    { icon: '🌐', label: 'Sites vitrines', desc: 'Landing pages, SEO, réservation, multilingue' },
    { icon: '⚙️', label: 'Apps métier', desc: 'PWA, tableaux de bord, API REST, offline-first' },
    { icon: '🎮', label: 'Expériences ludiques', desc: 'Portfolios interactifs, jeux web, WebGL' },
  ],
};

export const experience: Experience[] = [
  {
    company: 'CGI',
    period: '2025 – 2026',
    role: 'Alternance · Dev full stack',
    highlights: [
      'Front-end TypeScript : interfaces, composants et intégration API',
      'Back-end Java Spring : services, logique métier et API REST',
      'PostgreSQL : modélisation, requêtes et évolutions de schéma',
    ],
  },
  {
    company: 'Airbus Atlantic · Méaulte',
    period: '2024 – 2025',
    role: 'Alternance',
    highlights: [
      'Scripts internes pour automatisation et réduction du temps de traitement',
      'Support technique N2, parc de 250+ postes, gestion de workflow',
      'Collaboration en anglais avec des équipes en Inde',
    ],
  },
  {
    company: 'Numih · Amiens',
    period: '2023 – 2024',
    role: 'Stages',
    highlights: [
      'Requêtes SQL, automatisation de processus et documentation technique',
      'Support utilisateur, maintenance de 150+ machines, Active Directory',
    ],
  },
];

export const education: Education[] = [
  {
    school: 'UniLaSalle Amiens',
    degree: 'Cycle ingénieur RIOC (Réseaux, Informatique et Objets Connectés)',
    period: '2025 – 2026',
    highlights: [
      'Architecture logicielle, réseaux et systèmes, full stack, cybersécurité, objets connectés',
    ],
  },
  {
    school: "IUT d'Amiens",
    degree: 'Licence pro Réseaux et Génie Informatique',
    period: '2024 – 2025',
    highlights: [
      'Administration réseaux (TCP/IP, VLAN), Windows Server, scripting, C#, React',
    ],
  },
  {
    school: 'Lycée Saint-Rémi',
    degree: 'BTS SIO option SLAM',
    period: '2022 – 2024',
    highlights: [
      'POO (C#, Java), développement web, SQL/MySQL, UML, Linux/Windows, certification Cisco',
    ],
  },
];

export const languages: Language[] = [
  { name: 'Français', level: 'Langue maternelle' },
  { name: 'Anglais', level: 'C1 professionnel' },
];

export const softSkills = [
  'Autonomie et proactivité',
  'Organisation et rigueur',
  'Résolution de problèmes',
  'Communication technique',
  'Adaptabilité',
];

export const skills: Skill[] = [
  { name: 'Full Stack', category: 'fullstack' },
  { name: 'Architecture web', category: 'fullstack' },
  { name: 'APIs REST', category: 'fullstack' },
  { name: 'PWA', category: 'fullstack' },

  { name: 'React', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'HTML / CSS', category: 'frontend' },
  { name: 'Vite / Next.js', category: 'frontend' },
  { name: 'Framer Motion', category: 'frontend' },
  { name: 'Zustand', category: 'frontend' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'Canvas / WASM', category: 'frontend' },

  { name: 'Node.js / Express', category: 'backend' },
  { name: 'Java / Spring', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'Supabase / Neon', category: 'backend' },
  { name: 'SQL', category: 'backend' },
  { name: 'API design', category: 'backend' },

  { name: 'Java', category: 'languages' },
  { name: 'C# / .NET', category: 'languages' },
  { name: 'Python', category: 'languages' },
  { name: 'PHP', category: 'languages' },
  { name: 'C++', category: 'languages' },

  { name: 'Babylon.js', category: 'game' },
  { name: 'Godot 4', category: 'game' },
  { name: 'Unreal Engine 5', category: 'game' },
  { name: 'WebGL', category: 'game' },

  { name: 'Montage vidéo', category: 'creative' },
  { name: 'DaVinci Resolve', category: 'creative' },
  { name: 'After Effects', category: 'creative' },
  { name: 'Design UI', category: 'creative' },

  { name: 'TCP/IP & VLAN', category: 'network' },
  { name: 'Linux', category: 'network' },
  { name: 'Windows Server', category: 'network' },
  { name: 'Active Directory', category: 'network' },

  { name: 'Git / GitHub', category: 'tools' },
  { name: 'Vercel', category: 'tools' },
  { name: 'Docker', category: 'tools' },
  { name: 'Playwright', category: 'tools' },
  { name: 'Figma', category: 'tools' },
];

export const skillCategories: Record<Skill['category'], string> = {
  fullstack: 'Full Stack',
  frontend: 'Frontend',
  backend: 'Backend',
  languages: 'Langages',
  game: 'Game & 3D',
  creative: 'Créatif & Vidéo',
  network: 'Réseaux & Systèmes',
  tools: 'Outils & DevOps',
};

export const desktopApps = [
  { id: 'projects' as const, label: 'Projets', icon: '📁', color: '#58a8f0' },
  { id: 'explorer' as const, label: 'Explorateur', icon: '🗂️', color: '#c8a070' },
  { id: 'about' as const, label: 'À propos', icon: '👤', color: '#f0a8c8' },
  { id: 'stack' as const, label: 'Stack', icon: '⚡', color: '#a868e8' },
  { id: 'contact' as const, label: 'Contact', icon: '✉️', color: '#94c878' },
  { id: 'notes' as const, label: 'Notes', icon: '📝', color: '#f0c060' },
  { id: 'terminal' as const, label: 'Terminal', icon: '⌨️', color: '#8898b0' },
  { id: 'settings' as const, label: 'Paramètres', icon: '⚙️', color: '#98a8c8' },
];

export const miniGames = [
  { id: 'game-pong' as const, label: 'Pong', icon: '🏓', color: '#58a8f0' },
  { id: 'game-snake' as const, label: 'Snake', icon: '🐍', color: '#94c878' },
  { id: 'game-solitaire' as const, label: 'Solitaire', icon: '🃏', color: '#f0c060' },
  { id: 'game-2048' as const, label: '2048', icon: '🔢', color: '#e878a8' },
  { id: 'game-minesweeper' as const, label: 'Démineur', icon: '💣', color: '#8898b0' },
  { id: 'game-memory' as const, label: 'Memory', icon: '🎴', color: '#f0a8c8' },
  { id: 'game-breakout' as const, label: 'Breakout', icon: '🧱', color: '#c87858' },
  { id: 'game-tetris' as const, label: 'Tetris', icon: '🟦', color: '#6898c8' },
  { id: 'game-flappy' as const, label: 'Flappy', icon: '🐤', color: '#f0c060' },
] as const;

export type MiniGameId = (typeof miniGames)[number]['id'];

export type DesktopAppId =
  | (typeof desktopApps)[number]['id']
  | MiniGameId
  | 'project-detail';

export const allDesktopApps = [...desktopApps, ...miniGames];
