import { motion } from 'framer-motion';
import { skillCategories, skills, type Skill } from '../../data/profile';

const CATEGORY_ORDER: Skill['category'][] = [
  'fullstack',
  'frontend',
  'backend',
  'languages',
  'game',
  'creative',
  'tools',
];

export function StackApp() {
  return (
    <div className="app-stack">
      <header className="app-stack__header">
        <h2>Stack & compétences</h2>
        <p>Full Stack, web, langages, 3D, montage vidéo — un profil polyvalent.</p>
      </header>

      {CATEGORY_ORDER.map((cat, catIdx) => {
        const items = skills.filter((s) => s.category === cat);
        if (items.length === 0) return null;
        return (
          <motion.section
            key={cat}
            className="app-stack__section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.06, duration: 0.35 }}
          >
            <h3>{skillCategories[cat]}</h3>
            <div className="app-stack__tags">
              {items.map((skill) => (
                <span key={skill.name} className="app-stack__tag">
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
