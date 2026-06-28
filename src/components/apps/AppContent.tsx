import type { OsWindow } from '../../store/osStore';
import { AboutApp } from './AboutApp';
import { ContactApp } from './ContactApp';
import { ProjectDetailApp } from './ProjectDetailApp';
import { ProjectsApp } from './ProjectsApp';
import { StackApp } from './StackApp';
import { TerminalApp } from './TerminalApp';

interface AppContentProps {
  win: OsWindow;
}

export function AppContent({ win }: AppContentProps) {
  switch (win.appId) {
    case 'projects':
      return <ProjectsApp />;
    case 'about':
      return <AboutApp />;
    case 'stack':
      return <StackApp />;
    case 'contact':
      return <ContactApp />;
    case 'terminal':
      return <TerminalApp />;
    case 'project-detail':
      return <ProjectDetailApp projectId={win.payload?.projectId ?? ''} windowId={win.id} />;
    default:
      return null;
  }
}
