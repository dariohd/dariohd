# Portfolio interactif — documentation technique

Portfolio web gamifié de **dariohd** : chambre pixel art rétro + bureau fictif **DHD OS** pour présenter les projets.

---

## Parcours utilisateur

```
Écran titre → Chambre (canvas) → Boot DHD OS → Bureau → Apps & projets
                    ↑                                    │
                    └──────── escaliers / shutdown ──────┘
```

| Phase | Description |
|-------|-------------|
| **Titre** | Présentation, compteur de projets découverts, accès direct au bureau |
| **Chambre** | Exploration top-down, interaction PC et escaliers |
| **Boot** | Séquence type BIOS (skippable après la 1ʳᵉ visite) |
| **Bureau** | OS complet : fenêtres, taskbar, terminal, collection de projets |

---

## Lancer en local

**Prérequis** : Node.js 20+

```bash
git clone https://github.com/dariohd/dariohd.git
cd dariohd
npm install
npm run dev
```

→ [http://localhost:5174](http://localhost:5174)

### Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (port 5174) |
| `npm run build` | Build production dans `dist/` |
| `npm run preview` | Prévisualiser le build |
| `npm run generate-collision` | Régénère le masque collision (dev uniquement) |

---

## Contrôles

### Chambre

| Action | Clavier | Mobile |
|--------|---------|--------|
| Déplacement | `↑↓←→` ou `ZQSD` / `WASD` | D-pad tactile |
| Interagir (PC) | `E` ou `Entrée` | Bouton **E** |
| Escaliers (retour menu) | `E` ou `↑`/`↓` près des escaliers | Clic sur zone escaliers |
| Retour menu | Bouton « ← Menu » | idem |

### DHD OS (bureau)

| Raccourci | Action |
|-----------|--------|
| `Alt` + `1–5` | Ouvrir une app |
| `Échap` | Fermer la fenêtre active |
| `?` | Aide raccourcis |
| Clic icône / dossier | Ouvrir |
| Coin bas-droit fenêtre | Redimensionner |
| Double-clic barre titre | Maximiser / restaurer |

### Terminal intégré

```
help          — liste des commandes
whoami        — identité
projects      — liste des projets
open <id>     — ouvrir une fiche projet
stack         — ouvrir la stack
contact       — ouvrir le contact
studio        — retour chambre
shutdown      — éteindre → chambre
clear         — effacer l'écran
```

---

## Structure du projet

```
dariohd/
├── public/sprites/          # Assets pixel (chambre, Nate, collision)
├── src/
│   ├── components/
│   │   ├── os/              # Boot, Desktop, Window, Taskbar…
│   │   ├── apps/            # Projets, About, Stack, Contact, Terminal
│   │   └── RoomScene.tsx    # Scène chambre canvas
│   ├── game/                # Moteur chambre, audio, sprites
│   ├── data/                # profile.ts, projects.ts
│   ├── store/               # Zustand (phases, fenêtres)
│   └── styles/global.css    # Design system
├── scripts/                 # Outils collision (dev)
├── vercel.json              # Config déploiement Vercel
└── vite.config.ts
```

---

## Déploiement

### Vercel (recommandé)

1. Importer le repo [github.com/dariohd/dariohd](https://github.com/dariohd/dariohd)
2. Framework : **Vite**
3. Build : `npm run build`
4. Output : `dist`
5. `base: './'` est déjà configuré pour un hébergement statique

### GitHub Pages / hébergement statique

```bash
npm run build
# Servir le contenu de dist/ (avec fallback SPA si nécessaire)
```

---

## Développement — collision (optionnel)

Le masque de collision de la chambre est calibré et versionné. En dev uniquement :

- `?collision=1` — overlay debug des zones
- `?collision=edit` — éditeur de masque
- `npm run generate-collision` — régénère `public/sprites/nb2-bedroom-collision.png`

---

## Licence

Projet portfolio — code source disponible sur GitHub.  
Les sprites de la chambre sont des assets pixel rétro à usage non commercial.
