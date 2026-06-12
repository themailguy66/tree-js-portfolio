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
      { name: 'React', detail: 'Component-driven product interfaces with hooks, state management, and performance-aware rendering.' },
      { name: 'TypeScript', detail: 'Typed frontend and tooling code that catches mistakes earlier and makes larger features safer to change.' },
      { name: 'JavaScript', detail: 'Modern ES syntax, async workflows, browser APIs, and the DOM fundamentals behind every framework.' },
      { name: 'HTML/CSS', detail: 'Semantic markup, responsive layouts, accessible structure, animation, and polished visual systems.' },
      { name: 'Tailwind CSS', detail: 'Utility-first styling for fast, consistent product UI development, including TheMailHero’s frontend.' },
      { name: 'Three.js', detail: 'Procedural 3D scenes, cameras, lighting, and interactive browser experiences — including this workstation.' },
      { name: 'Responsive UI', detail: 'Interfaces that work across devices; this site falls back to a clean card layout on smaller screens.' },
    ],
  },
  {
    id: 'backend',
    label: 'BACKEND',
    accent: '#4ac94a',   /* desaturated terminal green, not vivid lime */
    skills: [
      { name: 'C#', detail: 'Primary backend language for services, tooling, and application logic that stays maintainable over time.' },
      { name: 'ASP.NET Core', detail: 'Web APIs with ASP.NET Core 9: dependency injection, middleware pipelines, Entity Framework Core, and hosted services.' },
      { name: 'REST APIs', detail: 'API design with clear contracts, sensible status codes, versioning, documentation, and predictable client behaviour.' },
      { name: 'SQL', detail: 'SQLite, MySQL, and PostgreSQL: schema design, indexing, database tuning, and debugging slow access paths.' },
      { name: 'Authentication', detail: 'JWT auth, session handling, endpoint protection, rate limiting, CAPTCHA, and CORS hardening.' },
      { name: 'Background jobs', detail: 'Queued and scheduled work with retries, idempotency, and safe failure handling.' },
    ],
  },
  {
    id: 'systems',
    label: 'SYSTEMS / DEVOPS',
    accent: '#ff3df5',
    skills: [
      { name: 'Linux', detail: 'Daily server operations across Ubuntu/CentOS, systemd, networking, permissions, and performance triage.' },
      { name: 'Docker', detail: 'Containerising services, debugging hosting environments, and isolating applications for reliable deployment.' },
      { name: 'Ansible', detail: 'System configuration and automated deployments for repeatable multi-server rollouts without manual drift.' },
      { name: 'GitHub Actions', detail: 'CI/CD pipelines and container registry workflows for safer, repeatable deployments.' },
      { name: 'Nginx / Apache', detail: 'Reverse proxies, TLS termination, virtual hosts, and troubleshooting misrouted traffic.' },
      { name: 'DNS', detail: 'Records, propagation, email authentication DNS, and diagnosing resolution failures.' },
      { name: 'Prometheus', detail: 'Metrics collection, alerting rules, and visibility into server and service health.' },
      { name: 'Grafana', detail: 'Dashboards that make incidents, capacity, and performance trends visible quickly.' },
      { name: 'Bash scripting', detail: 'Automation glue for audits, health checks, and safe read-only diagnostics.' },
    ],
  },
  {
    id: 'workflow',
    label: 'WORKFLOW',
    accent: '#ffb347',
    skills: [
      { name: 'Git', detail: 'Branching, reviews, clean history, safe rollbacks, and practical collaboration habits.' },
      { name: 'Debugging', detail: 'A systematic approach: reproduce, isolate, instrument, fix, and verify before moving on.' },
      { name: 'Automation', detail: 'Turning repeated manual work into scripts, playbooks, and checks that save time without hiding risk.' },
      { name: 'Technical documentation', detail: 'Runbooks, READMEs, and incident notes that future teammates can actually use.' },
      { name: 'Customer-facing problem solving', detail: 'Calm technical communication that turns urgent tickets into clear root causes and practical fixes.' },
    ],
  },
];
