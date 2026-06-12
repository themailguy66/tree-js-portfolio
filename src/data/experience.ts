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
      'Technical support and maintenance for Docker cloud containers, Linux VPS, cPanel/Plesk and Windows servers — keeping customer infrastructure fast and online.',
    points: [
      '"Monitoring czar": triaging alerts across server environments to ensure minimal downtime',
      'Real-time resolution of server crashes, performance bottlenecks and container failures',
      'System configuration and automation with Ansible, streamlining service delivery',
      'Proactive customer infrastructure analysis: optimisation, database tuning, resource scaling',
      'Mentoring new team members; team point of contact in manager’s absence',
      'Internal documentation, knowledge base articles and process improvement',
    ],
  },
  {
    id: 'themailhero',
    title: 'TheMailHero — Personal SaaS Project',
    period: 'ONGOING',
    summary:
      'Full-stack email deliverability testing platform (themailhero.com), built and operated end to end.',
    points: [
      'ASP.NET Core 9 backend with RESTful API, JWT auth and Entity Framework Core',
      'React 19 + TypeScript + Tailwind CSS frontend',
      'Multi-server Docker architecture with Ansible deployments and GitHub Container Registry',
      'Custom monitoring: Prometheus, Grafana, Alertmanager, Node Exporter, mobile alerts via ntfy.sh',
      'Production hardening: rate limiting, CAPTCHA, automated SSL, daily backups, zero-downtime deploys',
    ],
  },
];

export const technicalStrengths = [
  'Backend development (C#, ASP.NET Core, RESTful APIs, EF Core)',
  'Linux systems, Docker and Ansible automation',
  'Monitoring and observability (Prometheus, Grafana, Alertmanager)',
  'Databases (SQLite, MySQL, PostgreSQL) and tuning',
  'Debugging, incident response and root-cause analysis',
  'Frontend engineering (React, TypeScript, Tailwind, Three.js)',
];
