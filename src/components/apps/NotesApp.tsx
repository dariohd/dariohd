import { useDesktopStore } from '../../store/desktopStore';
import { profile } from '../../data/profile';

export function NotesApp() {
  const notes = useDesktopStore((s) => s.notes);
  const setNotes = useDesktopStore((s) => s.setNotes);

  return (
    <div className="app-notes">
      <header className="app-notes__header">
        <h2>Notes DHD</h2>
        <p>Bloc-notes local, sauvegardé sur ce poste</p>
      </header>
      <textarea
        className="app-notes__editor"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={`Idées, contacts, rappels…\n\n${profile.handle}`}
        spellCheck
      />
      <footer className="app-notes__footer">
        <span>{notes.length} caractères</span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setNotes('')}>
          Effacer
        </button>
      </footer>
    </div>
  );
}
