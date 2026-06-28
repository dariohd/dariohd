import { profile } from '../../data/profile';

export function ContactApp() {
  const { email, phone, github, linkedin, portfolio } = profile.links;

  return (
    <div className="app-contact">
      <header className="app-contact__header">
        <h2>Contact</h2>
        <p>Alternance, mission web, PWA ou expérience interactive : discutons-en.</p>
      </header>

      <div className="app-contact__cards">
        <a href={`mailto:${email}`} className="contact-card contact-card--primary">
          <span className="contact-card__icon" aria-hidden="true">✉️</span>
          <div>
            <strong>Email</strong>
            <p>{email}</p>
          </div>
        </a>

        <a href={`tel:${phone.replace(/\s/g, '')}`} className="contact-card">
          <span className="contact-card__icon" aria-hidden="true">📱</span>
          <div>
            <strong>Téléphone</strong>
            <p>{phone}</p>
          </div>
        </a>

        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-card__icon" aria-hidden="true">🐙</span>
            <div>
              <strong>GitHub</strong>
              <p>{github.replace('https://', '')}</p>
            </div>
          </a>
        )}

        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-card__icon" aria-hidden="true">💼</span>
            <div>
              <strong>LinkedIn</strong>
              <p>linkedin.com/in/hugodavion</p>
            </div>
          </a>
        )}

        {portfolio && (
          <a href={portfolio} target="_blank" rel="noopener noreferrer" className="contact-card">
            <span className="contact-card__icon" aria-hidden="true">🌐</span>
            <div>
              <strong>Portfolio classique</strong>
              <p>dariohd.github.io/hugodavion</p>
            </div>
          </a>
        )}
      </div>

      <p className="app-contact__brand">
        {profile.name} · <strong>{profile.brand}</strong> · {profile.title}
      </p>
    </div>
  );
}
