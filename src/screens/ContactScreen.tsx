import { profile } from '../data/profile';
import { GlitchText } from '../components/GlitchText';

/** Small radio uplink — final transmission / contact */
export function ContactScreen() {
  return (
    <div className="screen-body contact-screen">
      <header className="screen-header">
        <GlitchText text="CONTACT UPLINK" className="screen-title" />
        <span className="screen-classification">// DIRECT CHANNEL · READY</span>
      </header>

      <div className="contact-wave" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.07}s` }} />
        ))}
      </div>

      <p className="contact-pitch">
        Hiring for backend, full-stack, or DevOps-heavy product work? Send a message — I’m happy to talk through the role, the stack, and how I can help.
      </p>

      <dl className="contact-dl">
        <dt>EMAIL</dt>
        <dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
        <dt>GITHUB</dt>
        <dd><a href={profile.github} target="_blank" rel="noreferrer">{profile.github.replace('https://', '')}</a></dd>
        {profile.linkedin && (
          <>
            <dt>LINKEDIN</dt>
            <dd><a href={profile.linkedin} target="_blank" rel="noreferrer">{profile.linkedin.replace('https://', '')}</a></dd>
          </>
        )}
        <dt>LOCATION</dt>
        <dd>{profile.location}</dd>
      </dl>

      <a className="screen-btn screen-btn-accent contact-cta" href={`mailto:${profile.email}`}>
        ▸ EMAIL LUCAS
      </a>
    </div>
  );
}
