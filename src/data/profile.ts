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

  role: 'Developer / Systems Thinker / Backend-Focused Engineer',

  tagline: 'I build reliable systems, practical tools, and interfaces that feel alive.',

  summary:
    "I'm a developer with a strong systems mindset. I enjoy building practical software, " +
    'debugging complex problems, automating repetitive work, and turning messy technical ' +
    'requirements into clean, maintainable solutions. My background combines hosting ' +
    'operations, Linux systems, backend development, frontend interfaces, Docker, ' +
    'monitoring, and customer-facing technical problem solving.',

  location: 'Auckland, New Zealand',
  focus: 'Backend Development / Full-stack Tools',
  strengths: 'Debugging, Automation, Infrastructure, APIs, UI Polish',
  currentTarget: 'Software Developer / Backend Engineer',

  email: 'lucasboglione@gmail.com',
  github: 'https://github.com/nzarg',
  /** Leave empty to hide the LinkedIn link everywhere. TODO: add your URL */
  linkedin: '',

  /**
   * Path to your CV PDF. Place the file at: /public/cv.pdf
   * (anything in /public is served from the site root)
   */
  cvPath: '/cv.pdf',

  /** Top skills surfaced in Recruiter Quick Access */
  topSkills: [
    'C# / ASP.NET Core',
    'React + TypeScript',
    'Linux',
    'Docker & Ansible',
    'Monitoring (Prometheus/Grafana)',
    'RESTful APIs',
  ],
};

export type Profile = typeof profile;
