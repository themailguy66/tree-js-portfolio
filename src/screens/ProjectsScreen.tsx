import { useState } from 'react';
import { projects, type Project } from '../data/projects';
import { GlitchText } from '../components/GlitchText';

/** Upper monitor — encrypted case-file project archive */
export function ProjectsScreen() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <div className="screen-body projects-screen">
      <header className="screen-header">
        <GlitchText text="PROJECT ARCHIVE" className="screen-title" />
        <span className="screen-classification">// {projects.length} CASE FILES RECOVERED</span>
      </header>

      <div className="projects-grid">
        {projects.map((p) => (
          <article
            className="project-card"
            key={p.id}
            onClick={() => setOpenProject(p)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setOpenProject(p)}
            aria-label={`Open case file: ${p.name}`}
          >
            <div className="project-case-number">{p.caseNumber}</div>
            <h3 className="project-name">{p.name}</h3>
            <p className="project-type">{p.type}</p>
            <p className="project-desc">{p.description}</p>
            <div className="project-tech">
              {p.tech.map((t) => (
                <span className="project-tech-chip" key={t}>{t}</span>
              ))}
            </div>
            <div className="project-actions" onClick={(e) => e.stopPropagation()}>
              <button className="screen-btn screen-btn-sm" onClick={() => setOpenProject(p)}>
                DETAILS
              </button>
              {p.github && (
                <a className="screen-btn screen-btn-sm" href={p.github} target="_blank" rel="noreferrer">
                  GITHUB
                </a>
              )}
              {p.demo && (
                <a className="screen-btn screen-btn-sm" href={p.demo} target="_blank" rel="noreferrer">
                  LIVE
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Case file detail overlay (within the screen) */}
      {openProject && (
        <div className="project-detail-overlay">
          <div className="project-detail">
            <button
              className="project-detail-close"
              onClick={() => setOpenProject(null)}
              aria-label="Close case file"
            >
              ✕ CLOSE FILE
            </button>
            <div className="project-case-number">{openProject.caseNumber} · DECRYPTED</div>
            <h3 className="project-name">{openProject.name}</h3>
            <p className="project-type">{openProject.type}</p>
            <dl className="project-detail-dl">
              <dt>PROBLEM</dt><dd>{openProject.problem}</dd>
              <dt>WHAT I BUILT</dt><dd>{openProject.built}</dd>
              <dt>HIGHLIGHTS</dt>
              <dd>
                <ul>
                  {openProject.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </dd>
              <dt>STACK</dt><dd>{openProject.tech.join(' · ')}</dd>
            </dl>
            <div className="project-actions">
              {openProject.github && (
                <a className="screen-btn screen-btn-sm" href={openProject.github} target="_blank" rel="noreferrer">
                  GITHUB ↗
                </a>
              )}
              {openProject.demo && (
                <a className="screen-btn screen-btn-sm" href={openProject.demo} target="_blank" rel="noreferrer">
                  LIVE DEMO ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
