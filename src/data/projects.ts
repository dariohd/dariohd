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

export const projects: Project[] = [
  {
    id: 'maison-ela',
    name: "La Maison d'Ela",
    tagline: "Chambre d'hôtes de charme en Dordogne",
    description:
      "Site vitrine pour une maison d'hôtes à Jumilhac-le-Grand : séjours thématiques, galerie photo, réservation par e-mail et versions FR/EN.",
    url: 'https://www.lamaisondela.com',
    repo: 'https://github.com/dariohd/LaMaisonDEla',
    thumb: 'https://www.lamaisondela.com/images/piscine.jpg',
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
    thumb: 'https://quai-des-reves.vercel.app/images/og-image.jpg',
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
    thumb: 'https://www.etcbc-charpente.com/images/gallery/realisation-18.webp',
    preview: 'iframe',
    tags: ['Site pro', 'Galerie', 'SEO local', 'JavaScript'],
    color: '#c8a070',
    icon: '🪵',
    category: 'client',
  },
  {
    id: 'domainederoche',
    name: 'Domaine de Roche',
    tagline: 'Gîtes & château en Charente-Maritime',
    description:
      'Château et gîtes en Charente-Maritime : site Next.js multilingue, animations Framer Motion et SEO.',
    url: 'https://domainederoche.vercel.app/',
    repo: 'https://github.com/dariohd/DomaineDeRoche',
    preview: 'iframe',
    tags: ['Next.js', 'React 19', 'i18n', 'Framer Motion'],
    color: '#94c878',
    icon: '🏰',
    category: 'client',
  },
  {
    id: 'sqcdp',
    name: 'SQCDP',
    tagline: 'Pilotage industriel premium',
    description:
      'PWA React/TypeScript pour le suivi SQCDP : tableaux animés, mode Daily, PDCA/8D, stand-up, roulette de réunion, export CSV/PDF et synchronisation hors-ligne via API Express.',
    url: 'https://sqcdp.vercel.app/',
    repo: 'https://github.com/dariohd/SQCDP',
    thumb: 'https://sqcdp.vercel.app/favicon.svg',
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
      'Site commercial de l\'agence : offres artisans/tourisme, carrousel de réalisations, mini-navigateurs intégrés et modules JS.',
    url: 'https://www.bulletonsite.com',
    repo: 'https://github.com/dariohd/BulleTonSite',
    thumb: 'https://www.bulletonsite.com/assets/og-bubble.svg',
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
    id: 'pokerift',
    name: 'Rift Arena',
    tagline: 'Action RPG 3D en navigateur',
    description:
      'Jeu d\'arène 3D avec Babylon.js : hub dimensionnel, donjons, vagues d\'ennemis, combos et collection de figurines.',
    url: 'https://poke-rift.vercel.app/',
    repo: 'https://github.com/dariohd/PokeRift',
    preview: 'iframe',
    tags: ['Babylon.js', 'WebGL', 'Vite', 'Action RPG'],
    color: '#e878a8',
    icon: '⚔️',
    category: 'game',
  },
  {
    id: 'rumble-arena',
    name: 'Rumble Arena Web',
    tagline: 'Arène top-down & combat auto',
    description:
      'Jeu navigateur Canvas 2D : figurines, stages à débloquer, déplacement manuel, attaques automatiques et recrutement.',
    url: 'https://pokemonrumbleweb.vercel.app/',
    repo: 'https://github.com/dariohd/PokemonRumbleWeb',
    preview: 'iframe',
    tags: ['Canvas 2D', 'Vite', 'JavaScript', 'Jeu web'],
    color: '#94c878',
    icon: '🎯',
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

export function getThumbnailUrl(project: Project): string | null {
  return project.thumb ?? null;
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

export function saveDiscovered(set: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}
