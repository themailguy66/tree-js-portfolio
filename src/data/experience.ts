/**
 * ─────────────────────────────────────────────────────────────
 *  CV DOSSIER — EDIT ME
 *  Your experience timeline, newest first.
 * ─────────────────────────────────────────────────────────────
 */
export interface ExperienceEntry {
  id: string;
  title: string;
  period: string;
  summary: string;
  points: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: 'sitehost',
    title: 'System Developer, Operations — SiteHost',
    period: 'JUL 2023 — PRESENT',
    summary:
      'Production operations and systems development across Docker cloud containers, Linux VPS, cPanel/Plesk, and Windows servers — keeping customer infrastructure stable, fast, and online.',
    points: [
      'Monitoring lead for alert triage across server environments, helping reduce downtime and improve response quality',
      'Resolve server crashes, performance bottlenecks, and container failures in live customer environments',
      'Automate system configuration and service delivery with Ansible',
      'Analyse customer infrastructure proactively, including optimisation, database tuning, and resource scaling',
      'Mentor new team members and act as team point of contact when needed',
      'Write internal documentation, knowledge base articles, and process improvements that make support work easier to repeat',
    ],
  },
  {
    id: 'themailhero',
    title: 'TheMailHero — Personal SaaS Project',
    period: 'ONGOING',
    summary:
      'Full-stack email deliverability testing platform, built and operated end to end at themailhero.com.',
    points: [
      'ASP.NET Core 9 backend with REST API, JWT auth, and Entity Framework Core',
      'React 19 + TypeScript + Tailwind CSS frontend',
      'Multi-server Docker architecture with Ansible deployments through GitHub Container Registry',
      'Custom monitoring: Prometheus, Grafana, Alertmanager, Node Exporter, mobile alerts via ntfy.sh',
      'Production hardening: rate limiting, CAPTCHA, automated TLS, daily backups, and zero-downtime deployments',
    ],
  },
];

export const technicalStrengths = [
  'Backend development (C#, ASP.NET Core, REST APIs, EF Core)',
  'Linux systems, Docker and Ansible automation',
  'Monitoring and observability (Prometheus, Grafana, Alertmanager)',
  'Databases (SQLite, MySQL, PostgreSQL) and tuning',
  'Debugging, incident response and root-cause analysis',
  'Frontend engineering (React, TypeScript, Tailwind, Three.js)',
];
