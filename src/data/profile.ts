/**
 * ─────────────────────────────────────────────────────────────
 *  PROFILE — EDIT ME
 *  This is the single source of truth for your personal details.
 *  Nothing personal should be hardcoded anywhere else.
 * ─────────────────────────────────────────────────────────────
 */
export const profile = {
  name: 'Lucas Boglione',

  /** Cosmetic operator handle shown in the HUD / boot sequence */
  alias: 'OPERATOR//07',

  role: 'Backend-Focused Full-Stack Developer · DevOps & Production Systems',

  tagline: 'I build production-ready web apps, automation, and monitoring tools.',

  summary:
    'Backend-focused full-stack developer with hands-on production operations experience. ' +
    'I build APIs, internal tools, automation, monitoring, and polished React interfaces — ' +
    'with a bias for clear debugging, maintainable systems, and practical fixes that work in production.',

  location: 'Auckland, New Zealand',
  focus: 'Backend, full-stack tools, and production operations',
  strengths: 'Debugging, automation, infrastructure, APIs, monitoring, UI polish',
  currentTarget: 'Backend Developer / Full-Stack Developer roles',

  email: 'lucasboglione@gmail.com',
  github: 'https://github.com/nzarg',
  /** Leave empty to hide the LinkedIn link everywhere. TODO: add your URL */
  linkedin: '',

  /**
   * Path to your CV PDF. Place the file at: /public/cv.pdf
   * (anything in /public is served from the site root)
   */
  cvPath: '/cv.pdf',

  /** Path to your profile photo — shown in the Operator Profile screen */
  photoPath: '/lucas-photo.jpg',

  /** Top skills surfaced in Recruiter Quick Access */
  topSkills: [
    'C# / ASP.NET Core',
    'React + TypeScript',
    'Linux',
    'Docker & Ansible',
    'Monitoring (Prometheus/Grafana)',
    'REST APIs',
  ],
};

export type Profile = typeof profile;
