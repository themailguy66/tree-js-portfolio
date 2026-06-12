import type { ScreenId } from '../store';

/**
 * Terminal command definitions for the centre monitor.
 * Pure data + pure function — UI side effects (camera moves, flicker)
 * are executed by the terminal component based on the result.
 */
export interface CommandResult {
  /** Lines to print to the terminal */
  output: string[];
  /** Navigate the camera to a screen */
  nav?: ScreenId;
  /** Clear the terminal scrollback */
  clear?: boolean;
  /** Trigger the unlock easter egg */
  unlock?: boolean;
}

const NAV_COMMANDS: Record<string, { target: ScreenId; label: string }> = {
  about: { target: 'about', label: 'OPERATOR PROFILE' },
  skills: { target: 'skills', label: 'SKILL MATRIX' },
  projects: { target: 'projects', label: 'PROJECT ARCHIVE' },
  cv: { target: 'cv', label: 'CV DOSSIER' },
  contact: { target: 'contact', label: 'CONTACT UPLINK' },
  home: { target: 'home', label: 'MAIN TERMINAL' },
};

export const HELP_TEXT = [
  'AVAILABLE COMMANDS:',
  '  help      — show this list',
  '  about     — open operator profile',
  '  skills    — open skill matrix',
  '  projects  — open project archive',
  '  cv        — open CV dossier',
  '  contact   — open contact details',
  '  clear     — clear terminal',
  '  unlock    — ???',
];

export const UNLOCK_MESSAGE =
  'HIDDEN FILE UNLOCKED: This portfolio is a real React/Three.js project built to demonstrate ' +
  'frontend creativity, systems thinking, performance awareness, and production-style polish.';

export function runCommand(rawInput: string, ctx: { unlocked: boolean }): CommandResult {
  const input = rawInput.trim().toLowerCase();
  if (!input) return { output: [] };

  if (input === 'help') return { output: HELP_TEXT };
  if (input === 'clear') return { output: [], clear: true };

  if (input === 'unlock') {
    if (ctx.unlocked) {
      return { output: ['> FILE ALREADY DECRYPTED.', UNLOCK_MESSAGE] };
    }
    return {
      output: ['> DECRYPTING HIDDEN PARTITION...', '> POWER GRID UNSTABLE...', UNLOCK_MESSAGE],
      unlock: true,
    };
  }

  const nav = NAV_COMMANDS[input];
  if (nav) {
    return { output: [`> ROUTING SIGNAL → ${nav.label}`], nav: nav.target };
  }

  return { output: [`> UNKNOWN COMMAND: "${input}" — type 'help' or use the navigation menu`] };
}
