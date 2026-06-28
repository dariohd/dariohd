import { profile } from '../../data/profile';

export function ContactApp() {
  const { email, github, linkedin, website } = profile.links;

  return (
    <div className="app-contact">
      <header className="app-contact__header">
        <h2>Contact</h2>
        <p>Un projet web, une PWA ou une expérience interactive ? Discutons-en.</p>
      </header>

      <div className="app-contact__cards">
        <a href={`mailto:${email}`} className="contact-card contact-card--primary">
          <span className="contact-card__icon" aria-hidden="true">✉️</span>
          <div>
            <strong>Email</strong>
            <p>{email}</p>
          </div>
        </a>

        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-card__icon" aria-hidden="true">🌐</span>
            <div>
              <strong>{profile.brand}</strong>
              <p>{website.replace('https://', '')}</p>
            </div>
          </a>
        )}

        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-card__icon" aria-hidden="true">🐙</span>
            <div>
              <strong>GitHub</strong>
              <p>{github.replace('https://', '')}</p>
            </div>
          </a>
        )}

        {linkedin ? (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-card__icon" aria-hidden="true">💼</span>
            <div>
              <strong>LinkedIn</strong>
              <p>Profil professionnel</p>
            </div>
          </a>
        ) : (
          <div className="contact-card contact-card--muted">
            <span className="contact-card__icon" aria-hidden="true">💼</span>
            <div>
              <strong>LinkedIn</strong>
              <p>Disponible sur demande — écrivez-moi par email</p>
            </div>
          </div>
        )}
      </div>

      <p className="app-contact__brand">
        Propulsé par <strong>{profile.brand}</strong> — sites sur mesure pour artisans et PME en Dordogne et partout en France.
      </p>
    </div>
  );
}
