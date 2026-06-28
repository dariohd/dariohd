export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
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
      "Site vitrine élégant pour une maison d'hôtes en Périgord Vert : réservation, galerie photo, séjours thématiques et multilingue.",
    url: 'https://lamaisondela.com',
    preview: 'thumbnail',
    tags: ['HTML/CSS', 'Réservation', 'Galerie', 'Vercel'],
    color: '#f0a8c8',
    icon: '🦋',
    category: 'client',
  },
  {
    id: 'quai-reves',
    name: 'Quai des Rêves',
    tagline: 'Ancienne gare sur le GR37, Bretagne',
    description:
      "Landing immersive pour une maison d'hôtes dans une gare rénovée : storytelling, carte, galerie et réservation WhatsApp.",
    url: 'https://quai-des-reves.vercel.app/',
    preview: 'iframe',
    tags: ['Landing page', 'Storytelling', 'OpenStreetMap'],
    color: '#6898c8',
    icon: '🚂',
    category: 'client',
  },
  {
    id: 'etcbc',
    name: 'ETCBC',
    tagline: 'Charpente & construction bois',
    description:
      "Site professionnel pour une entreprise de charpente à Jumilhac-le-Grand : domaines d'activité, réalisations et contact.",
    url: 'https://www.etcbc-charpente.com/',
    preview: 'iframe',
    tags: ['Site pro', 'Galerie chantiers', 'SEO local'],
    color: '#c8a070',
    icon: '🪵',
    category: 'client',
  },
  {
    id: 'rochebonne',
    name: 'Domaine de Rochebonne',
    tagline: 'Gîtes & château en Charente-Maritime',
    description:
      'Château privatisé et 9 gîtes dans un parc de 13 000 m², à 10 min des plages. Site Next.js multilingue avec réservation.',
    url: 'https://ledomainederochebonne.com',
    preview: 'thumbnail',
    tags: ['Next.js', 'i18n', 'Framer Motion', 'Réservation'],
    color: '#94c878',
    icon: '🏰',
    category: 'client',
  },
  {
    id: 'sqcdp',
    name: 'SQCDP',
    tagline: 'Pilotage industriel premium',
    description:
      'Application PWA React/TypeScript pour le suivi SQCDP : tableaux de bord animés, PDCA, roulette réunion et mode hors-ligne.',
    url: 'https://sqcdp.vercel.app/',
    preview: 'iframe',
    tags: ['React', 'TypeScript', 'PWA', 'Supabase'],
    color: '#58a8f0',
    icon: '📊',
    category: 'product',
  },
  {
    id: 'bulle',
    name: 'Bulle',
    tagline: 'Assistant IA embarquable pour sites web',
    description:
      'Widget IA autonome greffable sur n\'importe quel site vitrine : chat contextuel, API Vercel, clés par domaine et démo intégrée.',
    url: 'https://bulle-chatbot.vercel.app',
    preview: 'thumbnail',
    tags: ['IA', 'Widget', 'Node.js', 'Vercel'],
    color: '#a868e8',
    icon: '💬',
    category: 'product',
  },
  {
    id: 'bulletonsite',
    name: 'Bulle ton site',
    tagline: 'Sites vitrines pour artisans & PME',
    description:
      'Plateforme commerciale et vitrine de l\'agence : offres, diapo promo, modules embed et démos pour clients locaux.',
    url: 'https://bulletonsite.com',
    preview: 'thumbnail',
    tags: ['Agence', 'Vitrine', 'Modules JS', 'SEO'],
    color: '#f0c060',
    icon: '🌐',
    category: 'product',
  },
  {
    id: 'rlreplay',
    name: 'RL Replay',
    tagline: 'Analyse & replay Rocket League',
    description:
      'Outil web pour revoir et analyser ses matchs Rocket League : replays, stats, parsing WASM et partage.',
    url: 'https://rl-replay.vercel.app/',
    preview: 'iframe',
    tags: ['Rocket League', 'Replay', 'WASM', 'Vite'],
    color: '#1a8fc4',
    icon: '🎮',
    category: 'product',
  },
  {
    id: 'pokerift',
    name: 'Pokémon Rumble Web',
    tagline: 'Toy Field & action RPG navigateur',
    description:
      'Jeu 3D style Pokémon Rumble avec Babylon.js : hub dimensionnel, donjons, vagues d\'ennemis, recrutement et combos.',
    url: 'https://poke-rift.vercel.app/',
    preview: 'iframe',
    tags: ['Babylon.js', 'WebGL', 'PWA', 'Vercel'],
    color: '#e878a8',
    icon: '🎎',
    category: 'game',
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getThumbnailUrl(url: string): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800`;
}

export function canEmbedPreview(project: Project): boolean {
  return project.preview === 'iframe';
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
