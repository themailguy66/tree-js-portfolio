/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECT ARCHIVE — EDIT ME
 *  Add / edit your project case files here.
 *  Set `github` / `demo` to real URLs or leave undefined to hide.
 * ─────────────────────────────────────────────────────────────
 */
export interface Project {
  id: string;
  caseNumber: string;
  name: string;
  type: string;
  description: string;
  tech: string[];
  problem: string;
  built: string;
  highlights: string[];
  github?: string;
  demo?: string;
}

export const projects: Project[] = [
  {
    id: 'themailhero',
    caseNumber: 'CASE-001',
    name: 'TheMailHero',
    type: 'SaaS / Email Testing Platform',
    description:
      'A full-stack SaaS platform for testing email deliverability: real-time SPF, DKIM and DMARC validation with instant results.',
    tech: ['ASP.NET Core 9', 'React 19', 'TypeScript', 'Tailwind', 'Docker', 'Ansible', 'Prometheus'],
    problem:
      'Diagnosing why email fails to deliver usually means juggling a dozen disconnected lookup tools.',
    built:
      'A complete product: RESTful API with JWT auth and EF Core, React frontend, multi-server Docker architecture with automated Ansible deployments.',
    highlights: [
      'Real-time SPF / DKIM / DMARC record validation',
      'Multi-server Docker architecture across two VPS instances',
      'Rate limiting, CAPTCHA, automated SSL, daily backups',
      'Zero-downtime deployments via GitHub Container Registry',
    ],
    github: undefined, // TODO: add repo link if public
    demo: 'https://themailhero.com',
  },
  {
    id: 'monitoring-stack',
    caseNumber: 'CASE-002',
    name: 'Custom Monitoring System',
    type: 'Infrastructure / Observability',
    description:
      'A comprehensive Prometheus and Grafana monitoring solution for Linux servers and cloud instances.',
    tech: ['Prometheus', 'Grafana', 'Alertmanager', 'Node Exporter', 'ntfy.sh', 'Linux'],
    problem:
      'Servers were a black box — failures were discovered by users instead of by alerts.',
    built:
      'End-to-end observability: exporters, scrape configs, dashboards, alert routing and real-time mobile notifications.',
    highlights: [
      'Metrics collection across multiple server environments',
      'Alertmanager routing with real-time mobile notifications via ntfy.sh',
      'Dashboards that surface performance patterns at a glance',
    ],
    github: undefined, // TODO: add repo link if public
  },
  {
    id: 'hosting-automation',
    caseNumber: 'CASE-003',
    name: 'Hosting Automation & Ops Tooling',
    type: 'Automation / Operations',
    description:
      'Ansible configuration and scripts for auditing and automating hosting environments, containers, services, and server state.',
    tech: ['Ansible', 'Bash', 'Python', 'Docker', 'Linux'],
    problem:
      'Manual environment investigation and configuration was slow, repetitive and inconsistent between operators.',
    built:
      'Automation and safe read-only audit tooling producing clear operational reports.',
    highlights: [
      'Reduced manual investigation time',
      'System configuration and automation with Ansible',
      'Clear operational reports for the whole team',
    ],
    github: undefined, // TODO: add repo link if public
  },
  {
    id: 'signal-desk',
    caseNumber: 'CASE-004',
    name: 'SIGNAL//DESK Portfolio',
    type: 'Creative Frontend / Three.js',
    description:
      'This website itself: a cinematic first-person developer workstation portfolio.',
    tech: ['React', 'TypeScript', 'Three.js', 'Animation', 'Responsive design'],
    problem:
      'Most developer portfolios look identical — and say nothing about how the developer thinks.',
    built:
      'A procedural 3D workstation with interactive monitors, terminal navigation and a recruiter-friendly fallback.',
    highlights: [
      'First-person 3D workstation',
      'Interactive monitors',
      'Terminal navigation',
      'Recruiter-friendly quick access',
      'Performance-aware design',
    ],
    github: undefined, // TODO: add link
  },
];

/** Projects surfaced in Recruiter Quick Access (best first) */
export const featuredProjectIds = ['themailhero', 'monitoring-stack', 'signal-desk'];
