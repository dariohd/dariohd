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
import { PongGame } from './games/PongGame';
import { SnakeGame } from './games/SnakeGame';
import { SolitaireGame } from './games/SolitaireGame';
import { Game2048 } from './games/Game2048';
import { MinesweeperGame } from './games/MinesweeperGame';
import { MemoryGame } from './games/MemoryGame';
import { BreakoutGame } from './games/BreakoutGame';
import { TetrisGame } from './games/TetrisGame';
import { FlappyGame } from './games/FlappyGame';

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
    case 'game-pong':
      return <PongGame />;
    case 'game-snake':
      return <SnakeGame />;
    case 'game-solitaire':
      return <SolitaireGame />;
    case 'game-2048':
      return <Game2048 />;
    case 'game-minesweeper':
      return <MinesweeperGame />;
    case 'game-memory':
      return <MemoryGame />;
    case 'game-breakout':
      return <BreakoutGame />;
    case 'game-tetris':
      return <TetrisGame />;
    case 'game-flappy':
      return <FlappyGame />;
    case 'project-detail':
      return <ProjectDetailApp projectId={win.payload?.projectId ?? ''} windowId={win.id} />;
    default:
      return null;
  }
}
