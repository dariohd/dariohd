import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { profile } from '../../data/profile';
import { projects } from '../../data/projects';
import { useAppStore } from '../../store/appStore';
import { useOsStore } from '../../store/osStore';

interface TermLine {
  type: 'in' | 'out' | 'err';
  text: string;
}

const HELP = `Commandes disponibles:
  help          — cette aide
  whoami        — identité
  about         — résumé
  projects      — liste des projets
  open <id>     — ouvrir un projet
  stack         — ouvrir la stack
  contact       — ouvrir le contact
  clear         — effacer l'écran
  studio        — retourner à la chambre
  shutdown      — éteindre le PC`;

export function TerminalApp() {
  const openApp = useOsStore((s) => s.openApp);
  const setPhase = useAppStore((s) => s.setPhase);
  const [lines, setLines] = useState<TermLine[]>([
    { type: 'out', text: 'DHD OS — Terminal v2.0' },
    { type: 'out', text: 'Tapez "help" pour commencer.' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setLines((prev) => [...prev, { type: 'in', text: `$ ${cmd}` }]);
    setHistory((prev) => [...prev, cmd]);
    setHistIdx(-1);

    const [name, ...args] = cmd.toLowerCase().split(/\s+/);
    const arg = args.join(' ');

    switch (name) {
      case 'help':
        setLines((prev) => [...prev, { type: 'out', text: HELP }]);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'whoami':
        setLines((prev) => [
          ...prev,
          { type: 'out', text: `${profile.name} (@${profile.handle}) — ${profile.title}` },
        ]);
        break;
      case 'about':
        setLines((prev) => [
          ...prev,
          { type: 'out', text: profile.tagline },
          ...profile.bio.map((b) => ({ type: 'out' as const, text: b })),
        ]);
        openApp('about');
        break;
      case 'projects':
        setLines((prev) => [
          ...prev,
          ...projects.map((p) => ({
            type: 'out' as const,
            text: `  ${p.id.padEnd(14)} ${p.icon} ${p.name}`,
          })),
        ]);
        openApp('projects');
        break;
      case 'open': {
        const project = projects.find((p) => p.id === arg);
        if (!project) {
          setLines((prev) => [...prev, { type: 'err', text: `Projet "${arg}" introuvable.` }]);
          break;
        }
        openApp('project-detail', { projectId: project.id });
        setLines((prev) => [...prev, { type: 'out', text: `Ouverture de ${project.name}…` }]);
        break;
      }
      case 'stack':
        openApp('stack');
        setLines((prev) => [...prev, { type: 'out', text: 'Ouverture Stack.app…' }]);
        break;
      case 'contact':
        openApp('contact');
        setLines((prev) => [...prev, { type: 'out', text: `Email: ${profile.links.email}` }]);
        break;
      case 'studio':
        setLines((prev) => [...prev, { type: 'out', text: 'Fermeture de la session DHD OS…' }]);
        setTimeout(() => {
          useOsStore.getState().closeAllWindows();
          setPhase('room');
        }, 400);
        break;
      case 'shutdown':
        setLines((prev) => [...prev, { type: 'out', text: 'shutdown -h now' }]);
        setTimeout(() => {
          useOsStore.getState().closeAllWindows();
          setPhase('room');
        }, 600);
        break;
      default:
        setLines((prev) => [
          ...prev,
          { type: 'err', text: `Commande inconnue: ${name}. Tapez "help".` },
        ]);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIdx < history.length - 1 ? histIdx + 1 : histIdx === -1 ? 0 : histIdx;
      setHistIdx(next);
      setInput(history[history.length - 1 - next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx <= 0) {
        setHistIdx(-1);
        setInput('');
      } else {
        const next = histIdx - 1;
        setHistIdx(next);
        setInput(history[history.length - 1 - next] ?? '');
      }
    }
  };

  return (
    <div className="app-terminal">
      <div className="app-terminal__output">
        {lines.map((line, i) => (
          <div key={`${i}-${line.text.slice(0, 12)}`} className={`app-terminal__line app-terminal__line--${line.type}`}>
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="app-terminal__input-row">
        <span className="app-terminal__prompt">$</span>
        <input
          type="text"
          className="app-terminal__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoFocus
          aria-label="Commande terminal"
        />
      </div>
    </div>
  );
}
