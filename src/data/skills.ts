/**
 * ─────────────────────────────────────────────────────────────
 *  SKILL MATRIX — EDIT ME
 *  Each skill has a `detail` shown when the node is clicked.
 * ─────────────────────────────────────────────────────────────
 */
export interface Skill {
  name: string;
  detail: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  accent: string; // CSS color for the category glow
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'FRONTEND',
    accent: '#2de8c8',
    skills: [
      { name: 'React', detail: 'Component-driven UIs with hooks, context and performance-aware rendering. This portfolio is built with it.' },
      { name: 'TypeScript', detail: 'Strict typing across frontend and tooling — catching bugs at compile time instead of in production.' },
      { name: 'JavaScript', detail: 'Modern ES syntax, async patterns, browser APIs and the DOM underneath every framework.' },
      { name: 'HTML/CSS', detail: 'Semantic markup, responsive layouts, animations and the dark-neon styling you are looking at right now.' },
      { name: 'Tailwind CSS', detail: 'Utility-first styling for product UIs — used across TheMailHero’s frontend.' },
      { name: 'Three.js', detail: 'Procedural 3D scenes, cameras, lighting and shaders — used to build this first-person workstation.' },
      { name: 'Responsive UI', detail: 'Interfaces that degrade gracefully: this site falls back to a clean card layout on mobile.' },
    ],
  },
  {
    id: 'backend',
    label: 'BACKEND',
    accent: '#4ac94a',   /* desaturated terminal green, not vivid lime */
    skills: [
      { name: 'C#', detail: 'Primary backend language — services, tooling and application logic with a focus on maintainability.' },
      { name: 'ASP.NET Core', detail: 'Web APIs with ASP.NET Core 9: dependency injection, middleware pipelines, Entity Framework Core and hosted services.' },
      { name: 'RESTful APIs', detail: 'Designing and consuming REST APIs: clear contracts, sensible status codes, versioning, docs.' },
      { name: 'SQL', detail: 'SQLite, MySQL and PostgreSQL — schema design, indexing, database tuning and debugging slow access paths.' },
      { name: 'Authentication', detail: 'JWT-based auth, session handling and locking down endpoints properly — plus rate limiting, CAPTCHA and CORS hardening.' },
      { name: 'Background jobs', detail: 'Queued and scheduled work — retries, idempotency and not losing data when things crash.' },
    ],
  },
  {
    id: 'systems',
    label: 'SYSTEMS / DEVOPS',
    accent: '#ff3df5',
    skills: [
      { name: 'Linux', detail: 'Daily driver for servers and ops — Ubuntu/CentOS, systemd, networking, permissions, performance triage.' },
      { name: 'Docker', detail: 'Used to containerise services, debug hosting environments, and isolate applications for reliable deployment — including custom cloud container infrastructure.' },
      { name: 'Ansible', detail: 'System configuration and automated deployments — multi-server rollouts without manual drift.' },
      { name: 'GitHub Actions', detail: 'CI/CD pipelines and container registry integration for zero-downtime deployments.' },
      { name: 'Nginx / Apache', detail: 'Reverse proxies, TLS termination, virtual hosts and tracking down misrouted traffic.' },
      { name: 'DNS', detail: 'Records, propagation, mail-related DNS (SPF/DKIM/DMARC) and diagnosing resolution failures.' },
      { name: 'Prometheus', detail: 'Metrics collection and alerting rules for servers and services.' },
      { name: 'Grafana', detail: 'Dashboards that make incidents visible at a glance instead of buried in logs.' },
      { name: 'Bash scripting', detail: 'Automation glue: audits, health checks and safe read-only diagnostics.' },
    ],
  },
  {
    id: 'workflow',
    label: 'WORKFLOW',
    accent: '#ffb347',
    skills: [
      { name: 'Git', detail: 'Branching, reviews, sensible history and not being afraid of the reflog.' },
      { name: 'Debugging', detail: 'A systematic approach: reproduce, isolate, instrument, fix, verify. My favourite part of the job.' },
      { name: 'Automation', detail: 'If a task gets done twice manually, it gets scripted the third time.' },
      { name: 'Technical documentation', detail: 'Runbooks, READMEs and incident notes that future humans can actually use.' },
      { name: 'Customer-facing problem solving', detail: 'Translating between angry tickets and root causes — calm, clear, technical communication.' },
    ],
  },
];
