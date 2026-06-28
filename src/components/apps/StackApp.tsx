import { motion } from 'framer-motion';
import { skillCategories, skills } from '../../data/profile';

export function StackApp() {
  const categories = Object.keys(skillCategories) as (keyof typeof skillCategories)[];

  return (
    <div className="app-stack">
      <header className="app-stack__header">
        <h2>Stack technique</h2>
        <p>Compétences utilisées au quotidien sur mes projets</p>
      </header>

      {categories.map((cat, catIdx) => {
        const items = skills.filter((s) => s.category === cat);
        if (items.length === 0) return null;
        return (
          <motion.section
            key={cat}
            className="app-stack__section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.08, duration: 0.35 }}
          >
            <h3>{skillCategories[cat]}</h3>
            <div className="app-stack__list">
              {items.map((skill, i) => (
                <div key={skill.name} className="skill-bar">
                  <div className="skill-bar__label">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="skill-bar__track">
                    <motion.div
                      className="skill-bar__fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{
                        delay: catIdx * 0.08 + i * 0.05 + 0.15,
                        duration: 0.65,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
