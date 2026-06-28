import { useState } from 'react';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useOsStore } from '../../store/osStore';

type TreeNode = {
  id: string;
  label: string;
  icon: string;
  children?: TreeNode[];
  projectId?: string;
  appId?: 'projects' | 'about' | 'stack' | 'contact' | 'notes' | 'terminal' | 'settings';
  url?: string;
};

const TREE: TreeNode[] = [
  {
    id: 'desktop',
    label: 'Bureau',
    icon: '🖥️',
    children: [
      { id: 'apps', label: 'Applications', icon: '📦', appId: 'projects' },
      { id: 'notes', label: 'Notes DHD.txt', icon: '📝', appId: 'notes' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: '📁',
    children: [
      { id: 'about', label: 'À propos — README.md', icon: '👤', appId: 'about' },
      { id: 'stack', label: 'stack.json', icon: '⚡', appId: 'stack' },
      { id: 'contact', label: 'contact.vcf', icon: '✉️', appId: 'contact' },
    ],
  },
  {
    id: 'projects',
    label: 'Projets',
    icon: '📂',
    children: projects.map((p) => ({
      id: p.id,
      label: `${p.icon} ${p.name}`,
      icon: p.icon,
      projectId: p.id,
    })),
  },
  {
    id: 'network',
    label: 'Réseau',
    icon: '🌐',
    children: [
      { id: 'site', label: profile.brand, icon: '🌐', url: profile.links.website },
      { id: 'github', label: 'GitHub', icon: '🐙', url: profile.links.github },
    ],
  },
];

function flattenVisible(nodes: TreeNode[], expanded: Set<string>, depth = 0): { node: TreeNode; depth: number }[] {
  const out: { node: TreeNode; depth: number }[] = [];
  for (const node of nodes) {
    out.push({ node, depth });
    if (node.children && expanded.has(node.id)) {
      out.push(...flattenVisible(node.children, expanded, depth + 1));
    }
  }
  return out;
}

export function ExplorerApp() {
  const openApp = useOsStore((s) => s.openApp);
  const discovered = useAppStore((s) => s.discovered);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['desktop', 'projects']));
  const [selected, setSelected] = useState<TreeNode | null>(null);

  const rows = flattenVisible(TREE, expanded);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openNode = (node: TreeNode) => {
    setSelected(node);
    if (node.projectId) openApp('project-detail', { projectId: node.projectId });
    else if (node.appId) openApp(node.appId);
    else if (node.url) window.open(node.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app-explorer">
      <header className="app-explorer__header">
        <h2>Explorateur de fichiers</h2>
        <p>{profile.alias} · Ce PC · {projects.length} projets indexés</p>
      </header>

      <div className="app-explorer__layout">
        <aside className="app-explorer__tree" aria-label="Arborescence">
          {rows.map(({ node, depth }) => {
            const hasKids = Boolean(node.children?.length);
            const isOpen = expanded.has(node.id);
            return (
              <button
                key={node.id}
                type="button"
                className={`app-explorer__row${selected?.id === node.id ? ' app-explorer__row--active' : ''}`}
                style={{ paddingLeft: `${0.5 + depth * 0.85}rem` }}
                onClick={() => {
                  if (hasKids) toggle(node.id);
                  else openNode(node);
                }}
                onDoubleClick={() => openNode(node)}
              >
                <span className="app-explorer__chevron" aria-hidden="true">
                  {hasKids ? (isOpen ? '▾' : '▸') : '·'}
                </span>
                <span>{node.icon}</span>
                <span className="app-explorer__label">{node.label}</span>
                {node.projectId && discovered.has(node.projectId) && (
                  <span className="app-explorer__badge">✓</span>
                )}
              </button>
            );
          })}
        </aside>

        <section className="app-explorer__panel">
          {selected ? (
            <>
              <h3>{selected.label}</h3>
              {selected.projectId ? (
                <>
                  <p>{projects.find((p) => p.id === selected.projectId)?.description}</p>
                  <button type="button" className="btn btn--primary btn--sm" onClick={() => openNode(selected)}>
                    Ouvrir la fiche
                  </button>
                </>
              ) : (
                <p className="app-explorer__hint">Double-clic ou bouton pour ouvrir.</p>
              )}
            </>
          ) : (
            <div className="app-explorer__empty">
              <span>🗂️</span>
              <p>Sélectionnez un fichier ou dossier dans l’arborescence.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
