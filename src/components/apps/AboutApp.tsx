import { profile } from '../../data/profile';
import { projects } from '../../data/projects';

export function AboutApp() {
  return (
    <div className="app-about">
      <div className="app-about__hero">
        <div className="app-about__avatar">{profile.alias[0]}</div>
        <div>
          <h2>{profile.name}</h2>
          <p className="app-about__title">{profile.title}</p>
          <p className="app-about__handle">@{profile.handle} · {profile.alias}</p>
          <p className="app-about__location">{profile.location}</p>
        </div>
      </div>

      <p className="app-about__tagline">{profile.tagline}</p>

      {profile.bio.map((paragraph) => (
        <p key={paragraph} className="app-about__bio">{paragraph}</p>
      ))}

      <div className="app-about__services">
        {profile.services.map((service) => (
          <div key={service.label} className="app-about__service">
            <span>{service.icon}</span>
            <div>
              <strong>{service.label}</strong>
              <p>{service.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="app-about__stats">
        <div>
          <strong>{projects.length}</strong>
          <span>Projets</span>
        </div>
        <div>
          <strong>{profile.alias}</strong>
          <span>Studio</span>
        </div>
      </div>
    </div>
  );
}
