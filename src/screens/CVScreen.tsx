import { useState } from 'react';
import { experience, technicalStrengths } from '../data/experience';
import { openCV, copyEmail } from '../utils/cv';
import { GlitchText } from '../components/GlitchText';

/** Desk tablet — decrypted personnel file / CV dossier */
export function CVScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="screen-body cv-screen">
      <header className="screen-header">
        <GlitchText text="CV DOSSIER" className="screen-title" />
        <span className="screen-classification">// PERSONNEL FILE DECRYPTED</span>
      </header>

      <div className="cv-timeline">
        {experience.map((entry) => (
          <div className="cv-entry" key={entry.id}>
            <div className="cv-entry-marker" />
            <div className="cv-entry-body">
              <h3 className="cv-entry-title">{entry.title}</h3>
              <span className="cv-entry-period">{entry.period}</span>
              <p className="cv-entry-summary">{entry.summary}</p>
              {expanded && (
                <ul className="cv-entry-points">
                  {entry.points.map((pt) => <li key={pt}>{pt}</li>)}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="cv-strengths">
          <h4>TECHNICAL STRENGTHS</h4>
          <ul>
            {technicalStrengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}

      <div className="cv-actions">
        <button
          className="screen-btn"
          onClick={async () => {
            const err = await openCV();
            setStatus(err ?? 'CV OPENED IN NEW TAB');
            setTimeout(() => setStatus(null), 4000);
          }}
        >
          ⬇ DOWNLOAD CV
        </button>
        <button className="screen-btn" onClick={() => setExpanded((e) => !e)}>
          {expanded ? 'COLLAPSE' : 'VIEW EXPERIENCE'}
        </button>
        <button
          className="screen-btn"
          onClick={async () => {
            setStatus((await copyEmail()) ? 'EMAIL COPIED TO CLIPBOARD' : 'CLIPBOARD UNAVAILABLE');
            setTimeout(() => setStatus(null), 3000);
          }}
        >
          ⧉ COPY EMAIL
        </button>
      </div>
      {status && <p className="cv-status" role="status">{status}</p>}
    </div>
  );
}
