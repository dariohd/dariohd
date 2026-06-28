export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'game' | 'tools';
}

export const profile = {
  name: 'dariohd',
  alias: 'DHD',
  handle: 'dariohd',
  title: 'Développeur web & créateur d\'expériences interactives',
  tagline: 'Sites vitrines, PWA métier et jeux navigateur — du pixel au WebGL.',
  location: 'Dordogne, France',
  brand: 'Bulle ton site',
  bio: [
    'Je conçois des sites web sur mesure pour des clients locaux et des produits SaaS légers.',
    'Mon terrain de jeu : React, TypeScript, PWA, Vercel — et parfois Babylon.js quand il faut pousser le ludique.',
    'Chaque projet est pensé pour être rapide, accessible et agréable à utiliser au quotidien.',
  ],
  links: {
    email: 'davionhugo@gmail.com',
    github: 'https://github.com/dariohd',
    linkedin: '',
    website: 'https://bulletonsite.com',
  },
  services: [
    { icon: '🌐', label: 'Sites vitrines', desc: 'Landing pages, SEO, réservation' },
    { icon: '⚙️', label: 'Apps métier', desc: 'PWA, tableaux de bord, offline-first' },
    { icon: '🎮', label: 'Expériences ludiques', desc: 'Portfolios interactifs, jeux web' },
  ],
};

export const skills: Skill[] = [
  { name: 'React', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 88, category: 'frontend' },
  { name: 'HTML / CSS', level: 92, category: 'frontend' },
  { name: 'Vite / Next.js', level: 85, category: 'frontend' },
  { name: 'PWA', level: 82, category: 'frontend' },
  { name: 'Node.js', level: 70, category: 'backend' },
  { name: 'Vercel', level: 88, category: 'tools' },
  { name: 'Babylon.js', level: 75, category: 'game' },
  { name: 'Canvas / WebGL', level: 78, category: 'game' },
  { name: 'Git', level: 85, category: 'tools' },
  { name: 'Framer Motion', level: 80, category: 'frontend' },
  { name: 'Zustand', level: 82, category: 'frontend' },
];

export const skillCategories: Record<Skill['category'], string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  game: 'Game & 3D',
  tools: 'Outils & DevOps',
};

export const desktopApps = [
  { id: 'projects' as const, label: 'Projets', icon: '📁', color: '#58a8f0' },
  { id: 'about' as const, label: 'À propos', icon: '👤', color: '#f0a8c8' },
  { id: 'stack' as const, label: 'Stack', icon: '⚡', color: '#a868e8' },
  { id: 'contact' as const, label: 'Contact', icon: '✉️', color: '#94c878' },
  { id: 'terminal' as const, label: 'Terminal', icon: '⌨️', color: '#c8a070' },
];

export type DesktopAppId = (typeof desktopApps)[number]['id'] | 'project-detail';
