export interface Skill {
  name: string;
  category: 'fullstack' | 'frontend' | 'backend' | 'languages' | 'game' | 'creative' | 'tools';
}

export const profile = {
  name: 'dariohd',
  alias: 'DHD',
  handle: 'dariohd',
  title: 'Développeur web & créateur d\'expériences interactives',
  tagline: 'Sites vitrines, PWA métier et jeux navigateur, du pixel au WebGL.',
  location: 'Dordogne, France',
  brand: 'dariohd',
  bio: [
    'Je conçois des sites web sur mesure pour des clients locaux et des produits SaaS légers.',
    'Mon terrain de jeu : React, TypeScript, PWA, Vercel, et parfois Babylon.js quand il faut pousser le ludique.',
    'Chaque projet est pensé pour être rapide, accessible et agréable à utiliser au quotidien.',
  ],
  links: {
    email: 'davionhugo@gmail.com',
    github: 'https://github.com/dariohd',
    linkedin: '',
  },
  services: [
    { icon: '🌐', label: 'Sites vitrines', desc: 'Landing pages, SEO, réservation' },
    { icon: '⚙️', label: 'Apps métier', desc: 'PWA, tableaux de bord, offline-first' },
    { icon: '🎮', label: 'Expériences ludiques', desc: 'Portfolios interactifs, jeux web' },
  ],
};

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

  { name: 'Node.js', category: 'backend' },
  { name: 'Supabase', category: 'backend' },
  { name: 'SQL', category: 'backend' },
  { name: 'API design', category: 'backend' },

  { name: 'Java', category: 'languages' },
  { name: 'C#', category: 'languages' },
  { name: '.NET', category: 'languages' },
  { name: 'Python', category: 'languages' },

  { name: 'Babylon.js', category: 'game' },
  { name: 'Canvas / WebGL', category: 'game' },
  { name: 'Godot', category: 'game' },

  { name: 'Montage vidéo', category: 'creative' },
  { name: 'DaVinci Resolve', category: 'creative' },
  { name: 'After Effects', category: 'creative' },
  { name: 'Design UI', category: 'creative' },
  { name: 'Motion design', category: 'creative' },

  { name: 'Git', category: 'tools' },
  { name: 'Vercel', category: 'tools' },
  { name: 'Docker', category: 'tools' },
  { name: 'Figma', category: 'tools' },
  { name: 'Linux', category: 'tools' },
];

export const skillCategories: Record<Skill['category'], string> = {
  fullstack: 'Full Stack',
  frontend: 'Frontend',
  backend: 'Backend',
  languages: 'Langages',
  game: 'Game & 3D',
  creative: 'Créatif & Vidéo',
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
