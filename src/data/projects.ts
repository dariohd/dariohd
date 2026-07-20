export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  repo?: string;
  thumb?: string;
  tags: string[];
  color: string;
  icon: string;
  preview: 'iframe' | 'thumbnail';
  category: 'client' | 'product' | 'game';
}

/** Catalogue vitrine : focus recruteur / école (prod, stack moderne, preuves client). */
export const projects: Project[] = [
  {
    id: 'planning',
    name: 'Planning',
    tagline: 'Présence atelier · Next.js + Prisma',
    description:
      'Outil métier de planning de présence : Auth.js, Neon Postgres, i18n FR/EN/PT, graphiques et tests Playwright. Migré depuis Google Apps Script.',
    url: 'https://planning-black-xi.vercel.app/',
    repo: 'https://github.com/dariohd/Planning',
    preview: 'iframe',
    tags: ['Next.js', 'Prisma', 'Auth.js', 'Neon', 'Playwright'],
    color: '#3d8bfd',
    icon: '📅',
    category: 'product',
  },
  {
    id: 'maison-ela',
    name: "La Maison d'Ela",
    tagline: "Chambre d'hôtes de charme en Dordogne",
    description:
      "Site vitrine pour une maison d'hôtes à Jumilhac-le-Grand : séjours thématiques, galerie photo, réservation et versions FR/EN.",
    url: 'https://www.lamaisondela.com',
    repo: 'https://github.com/dariohd/LaMaisonDEla',
    preview: 'thumbnail',
    tags: ['HTML/CSS', 'Galerie', 'Multilingue', 'SEO'],
    color: '#f0a8c8',
    icon: '🦋',
    category: 'client',
  },
  {
    id: 'quai-reves',
    name: 'Quai des Rêves',
    tagline: 'Ancienne gare sur le GR37, Bretagne',
    description:
      "Landing immersive pour une maison d'hôtes dans une gare rénovée : storytelling, chambres, carte OpenStreetMap et demande de réservation.",
    url: 'https://quai-des-reves.vercel.app/',
    repo: 'https://github.com/dariohd/QuaiDesReves',
    preview: 'iframe',
    tags: ['Landing', 'Storytelling', 'OpenStreetMap', 'Vercel'],
    color: '#6898c8',
    icon: '🚂',
    category: 'client',
  },
  {
    id: 'etcbc',
    name: 'ETCBC',
    tagline: 'Charpente & construction bois',
    description:
      "Site professionnel pour une entreprise de charpente à Jumilhac-le-Grand : métiers, zone d'intervention, galerie de chantiers filtrable et devis.",
    url: 'https://www.etcbc-charpente.com/',
    repo: 'https://github.com/dariohd/ETCBC',
    preview: 'iframe',
    tags: ['Site pro', 'Galerie', 'SEO local', 'JavaScript'],
    color: '#c8a070',
    icon: '🪵',
    category: 'client',
  },
  {
    id: 'domainederoche',
    name: 'Domaine de Roche',
    tagline: 'Template démo · gîtes & château',
    description:
      'Template Next.js multilingue (Bulle ton site) : Framer Motion, SEO, réservation. Placeholders volontaires — catalogue template, pas un site client.',
    url: 'https://domainederoche.vercel.app/',
    repo: 'https://github.com/dariohd/DomaineDeRoche',
    preview: 'iframe',
    tags: ['Next.js', 'Template', 'i18n', 'Framer Motion'],
    color: '#94c878',
    icon: '🏰',
    category: 'product',
  },
  {
    id: 'sqcdp',
    name: 'SQCDP',
    tagline: 'Pilotage industriel premium',
    description:
      'PWA React/TypeScript pour le suivi SQCDP : tableaux animés, mode Daily, PDCA/8D, stand-up, export CSV/PDF et synchronisation hors-ligne.',
    url: 'https://sqcdp.vercel.app/',
    repo: 'https://github.com/dariohd/SQCDP',
    preview: 'iframe',
    tags: ['React', 'TypeScript', 'PWA', 'Express', 'PostgreSQL'],
    color: '#58a8f0',
    icon: '📊',
    category: 'product',
  },
  {
    id: 'bulle',
    name: 'Bulle',
    tagline: 'Assistant IA embarquable pour sites web',
    description:
      'Widget IA greffable sur un site vitrine : chat contextuel, indexation du contenu, clés par domaine et déploiement Vercel.',
    url: 'https://bulle-chatbot.vercel.app',
    repo: 'https://github.com/dariohd/BulleChatBot',
    preview: 'iframe',
    tags: ['Next.js', 'AI SDK', 'Widget', 'Vercel'],
    color: '#a868e8',
    icon: '💬',
    category: 'product',
  },
  {
    id: 'bulletonsite',
    name: 'Bulle ton site',
    tagline: 'Sites vitrines pour artisans & PME',
    description:
      "Site commercial de l'agence : offres artisans/tourisme, carrousel de réalisations, mini-navigateurs intégrés et modules JS.",
    url: 'https://www.bulletonsite.com',
    repo: 'https://github.com/dariohd/BulleTonSite',
    preview: 'thumbnail',
    tags: ['Agence', 'Modules JS', 'Thèmes CSS', 'Vercel'],
    color: '#f0c060',
    icon: '🌐',
    category: 'product',
  },
  {
    id: 'rlreplay',
    name: 'RL Replay',
    tagline: 'Analyse & replay Rocket League',
    description:
      'Outil 100 % client pour analyser ses replays Rocket League : parsing WASM, minimap, stats boost/possession et comparaison multi-replays.',
    url: 'https://rl-replay.vercel.app/',
    repo: 'https://github.com/dariohd/RLReplay',
    preview: 'iframe',
    tags: ['Vite', 'WASM', 'Canvas 2D', 'Rocket League'],
    color: '#1a8fc4',
    icon: '🎮',
    category: 'product',
  },
  {
    id: 'hugodavion',
    name: 'hugodavion',
    tagline: 'Portfolio technique classique',
    description:
      'Portfolio HTML/CSS/JS : compétences, stack, projets filtrables par domaine, captures Playwright et CV intégré.',
    url: 'https://hugodavion.vercel.app/',
    repo: 'https://github.com/dariohd/hugodavion',
    preview: 'iframe',
    tags: ['HTML/CSS', 'GSAP', 'SEO', 'Vercel'],
    color: '#8898b0',
    icon: '📄',
    category: 'product',
  },
  {
    id: 'pokearena',
    name: 'PokeArena',
    tagline: 'Figurines 2.5D · PokéAPI live',
    description:
      'Arène web Phaser 3 : combat auto, vagues, combos, recrutement. Stats et sprites officiels via PokéAPI.',
    url: 'https://pokearena-topaz.vercel.app/',
    repo: 'https://github.com/dariohd/PokeArena',
    preview: 'iframe',
    tags: ['Phaser 3', 'TypeScript', 'PokéAPI', '2.5D'],
    color: '#3cf0ff',
    icon: '⚔️',
    category: 'game',
  },
  {
    id: 'dex-explorer',
    name: 'Dex Explorer',
    tagline: 'Encyclopédie de créatures via API publique',
    description:
      'Application web React : fiches détaillées, évolutions, formes alternatives, recherche FR et comparaison de stats. Version desktop WPF dans le même dépôt.',
    url: 'https://github.com/dariohd/Pokedex',
    repo: 'https://github.com/dariohd/Pokedex',
    thumb: '/projects/dex-explorer.svg',
    preview: 'thumbnail',
    tags: ['React 19', 'TypeScript', 'API REST', 'Tailwind'],
    color: '#f0c060',
    icon: '🔍',
    category: 'game',
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getThumbnailUrl(project: Project): string {
  if (project.thumb) return project.thumb;
  return `/projects/${project.id}.jpg`;
}

export function canEmbedPreview(project: Project): boolean {
  return project.preview === 'iframe';
}

export function isRepoUrl(url: string): boolean {
  return url.includes('github.com');
}

export const STORAGE_KEY = 'agence-davio-discovered';

export function loadDiscovered(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveDiscovered(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}
