import { profile } from '../data/profile';
import { GlitchText } from '../components/GlitchText';

/** Left monitor — classified operator personnel file */
export function AboutScreen() {
  return (
    <div className="screen-body about-screen">
      <header className="screen-header">
        <GlitchText text="OPERATOR PROFILE" className="screen-title" />
        <span className="screen-classification">// CLASSIFIED — LEVEL 4</span>
      </header>

      <div className="about-grid">
        <div className="about-id-card">
          <div className="about-photo" aria-hidden="true">
            {profile.photoPath
              ? <img src={profile.photoPath} alt={profile.name} className="about-photo-img" />
              : <div className="about-silhouette" />
            }
            <div className="about-photo-scan" />
          </div>
          <div className="about-id-meta">
            <span className="about-id-label">ID</span>
            <span className="about-id-value">{profile.alias}</span>
            <span className="about-id-label">STATUS</span>
            <span className="about-id-value about-id-active">● ACTIVE</span>
          </div>
        </div>

        <div className="about-fields">
          <p className="about-summary">{profile.summary}</p>
          <dl className="about-dl">
            <dt>LOCATION</dt><dd>{profile.location}</dd>
            <dt>FOCUS</dt><dd>{profile.focus}</dd>
            <dt>STRENGTHS</dt><dd>{profile.strengths}</dd>
            <dt>OPEN TO</dt><dd>{profile.currentTarget}</dd>
          </dl>

          <div className="about-bars" aria-hidden="true">
            {['SYSTEMS', 'BACKEND', 'FRONTEND', 'OPS'].map((label, i) => (
              <div className="about-bar-row" key={label}>
                <span>{label}</span>
                <div className="about-bar">
                  <div className="about-bar-fill" style={{ animationDelay: `${i * 0.25}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="screen-footer">FILE 7741-A · DECRYPTED · READY FOR REVIEW</footer>
    </div>
  );
}
