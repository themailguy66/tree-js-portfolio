import { useState } from 'react';
import { skillCategories, type Skill } from '../data/skills';
import { GlitchText } from '../components/GlitchText';

/** Right monitor — glowing skill matrix dashboard with clickable nodes */
export function SkillsScreen() {
  const [selected, setSelected] = useState<{ skill: Skill; accent: string } | null>(null);

  return (
    <div className="screen-body skills-screen">
      <header className="screen-header">
        <GlitchText text="SKILL MATRIX" className="screen-title" />
        <span className="screen-classification">// CAPABILITY SCAN COMPLETE</span>
      </header>

      <div className="skills-grid">
        {skillCategories.map((cat) => (
          <section className="skills-category" key={cat.id} style={{ ['--accent' as string]: cat.accent }}>
            <h3 className="skills-category-label">{cat.label}</h3>
            <div className="skills-nodes">
              {cat.skills.map((skill) => (
                <button
                  key={skill.name}
                  className={`skill-node ${selected?.skill.name === skill.name ? 'selected' : ''}`}
                  onClick={() =>
                    setSelected(
                      selected?.skill.name === skill.name ? null : { skill, accent: cat.accent },
                    )
                  }
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div
        className={`skill-detail ${selected ? 'open' : ''}`}
        style={selected ? { ['--accent' as string]: selected.accent } : undefined}
        aria-live="polite"
      >
        {selected ? (
          <>
            <strong>{selected.skill.name}</strong> — {selected.skill.detail}
          </>
        ) : (
          <span className="skill-detail-hint">▸ SELECT A SKILL TO VIEW HOW I USE IT</span>
        )}
      </div>
    </div>
  );
}
