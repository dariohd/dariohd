import { education, experience, languages, profile, softSkills } from '../../data/profile';
import { projects } from '../../data/projects';

export function AboutApp() {
  return (
    <div className="app-about">
      <div className="app-about__hero">
        <div className="app-about__avatar">{profile.name[0]}</div>
        <div>
          <h2>{profile.name}</h2>
          <p className="app-about__title">{profile.title}</p>
          <p className="app-about__handle">@{profile.handle} · {profile.alias}</p>
          <p className="app-about__location">{profile.location} · {profile.age} ans</p>
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

      <section className="app-about__section">
        <h3>Expérience</h3>
        <ul className="app-about__timeline">
          {experience.map((item) => (
            <li key={`${item.company}-${item.period}`} className="app-about__timeline-item">
              <div className="app-about__timeline-head">
                <strong>{item.company}</strong>
                <span>{item.period}</span>
              </div>
              <p className="app-about__timeline-role">{item.role}</p>
              <ul>
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="app-about__section">
        <h3>Formation</h3>
        <ul className="app-about__timeline">
          {education.map((item) => (
            <li key={`${item.school}-${item.period}`} className="app-about__timeline-item">
              <div className="app-about__timeline-head">
                <strong>{item.degree}</strong>
                <span>{item.period}</span>
              </div>
              <p className="app-about__timeline-role">{item.school}</p>
              <ul>
                {item.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="app-about__section">
        <h3>Langues</h3>
        <ul className="app-about__langs">
          {languages.map((lang) => (
            <li key={lang.name}>
              <strong>{lang.name}</strong> · {lang.level}
            </li>
          ))}
        </ul>
      </section>

      <section className="app-about__section">
        <h3>Soft skills</h3>
        <div className="app-about__pills">
          {softSkills.map((skill) => (
            <span key={skill} className="app-about__pill">{skill}</span>
          ))}
        </div>
      </section>

      <div className="app-about__stats">
        <div>
          <strong>{projects.length}</strong>
          <span>Projets</span>
        </div>
        <div>
          <strong>{profile.alias}</strong>
          <span>Studio</span>
        </div>
        <div>
          <strong>EN C1</strong>
          <span>Anglais</span>
        </div>
      </div>
    </div>
  );
}
