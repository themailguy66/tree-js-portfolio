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
      'A production SaaS app that helps teams diagnose email deliverability issues with SPF, DKIM, and DMARC checks in one place.',
    tech: ['ASP.NET Core 9', 'React 19', 'TypeScript', 'Tailwind', 'Docker', 'Ansible', 'Prometheus'],
    problem:
      'Email authentication problems are hard to diagnose because SPF, DKIM, DMARC, DNS, and server behaviour are usually checked in separate tools.',
    built:
      'A complete product: ASP.NET Core API with JWT auth and EF Core, React frontend, multi-server Docker hosting, and automated Ansible deployments.',
    highlights: [
      'SPF, DKIM, and DMARC checks with clear pass/fail guidance',
      'Multi-server Docker architecture across two VPS instances',
      'Rate limiting, CAPTCHA, automated TLS, and daily backups',
      'Zero-downtime deployments through GitHub Container Registry',
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
      'A Prometheus and Grafana monitoring stack that makes server health, alerts, and performance trends visible before users notice problems.',
    tech: ['Prometheus', 'Grafana', 'Alertmanager', 'Node Exporter', 'ntfy.sh', 'Linux'],
    problem:
      'Server failures and resource pressure were too easy to miss until they became customer-facing incidents.',
    built:
      'End-to-end observability: exporters, scrape configs, dashboards, alert routing, and real-time mobile notifications.',
    highlights: [
      'Metrics collection across multiple server environments',
      'Alertmanager routing with real-time mobile notifications via ntfy.sh',
      'Dashboards that surface capacity and performance patterns quickly',
    ],
    github: undefined, // TODO: add repo link if public
  },
  {
    id: 'hosting-automation',
    caseNumber: 'CASE-003',
    name: 'Hosting Automation & Ops Tooling',
    type: 'Automation / Operations',
    description:
      'Ansible playbooks and scripts for auditing hosting environments, automating configuration, and reporting server state safely.',
    tech: ['Ansible', 'Bash', 'Python', 'Docker', 'Linux'],
    problem:
      'Manual environment investigation and configuration was slow, repetitive, and inconsistent between operators.',
    built:
      'Automation and read-only audit tooling that turns server checks into clear operational reports.',
    highlights: [
      'Reduced repetitive manual investigation',
      'System configuration and automation with Ansible',
      'Clear operational reports for handoffs and team visibility',
    ],
    github: undefined, // TODO: add repo link if public
  },
  {
    id: 'signal-desk',
    caseNumber: 'CASE-004',
    name: 'SIGNAL//DESK Portfolio',
    type: 'Creative Frontend / Three.js',
    description:
      'This portfolio: a cinematic React and Three.js workstation that turns a CV into an interactive product experience.',
    tech: ['React', 'TypeScript', 'Three.js', 'Animation', 'Responsive design'],
    problem:
      'Most developer portfolios look identical and give recruiters little sense of how the developer thinks, builds, or handles polish.',
    built:
      'A procedural 3D workstation with interactive monitors, terminal navigation, responsive fallbacks, and a plain-text recruiter path.',
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
