import type { OsWindow } from '../../store/osStore';
import { AboutApp } from './AboutApp';
import { ContactApp } from './ContactApp';
import { ExplorerApp } from './ExplorerApp';
import { NotesApp } from './NotesApp';
import { ProjectDetailApp } from './ProjectDetailApp';
import { ProjectsApp } from './ProjectsApp';
import { SettingsApp } from './SettingsApp';
import { StackApp } from './StackApp';
import { TerminalApp } from './TerminalApp';

interface AppContentProps {
  win: OsWindow;
}

export function AppContent({ win }: AppContentProps) {
  switch (win.appId) {
    case 'projects':
      return <ProjectsApp />;
    case 'explorer':
      return <ExplorerApp />;
    case 'about':
      return <AboutApp />;
    case 'stack':
      return <StackApp />;
    case 'contact':
      return <ContactApp />;
    case 'notes':
      return <NotesApp />;
    case 'terminal':
      return <TerminalApp />;
    case 'settings':
      return <SettingsApp />;
    case 'project-detail':
      return <ProjectDetailApp projectId={win.payload?.projectId ?? ''} windowId={win.id} />;
    default:
      return null;
  }
}
