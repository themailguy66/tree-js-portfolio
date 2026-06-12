import { profile } from '../data/profile';

/**
 * Opens the CV PDF in a new tab, with sensible error handling:
 * verifies the file actually exists first so a missing /public/cv.pdf
 * produces a clear message instead of a broken tab.
 *
 * Returns an error string, or null on success.
 */
export async function openCV(): Promise<string | null> {
  try {
    const res = await fetch(profile.cvPath, { method: 'HEAD' });
    // Vite dev server returns index.html (200, text/html) for unknown paths,
    // so also reject non-PDF content types.
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || type.includes('text/html')) {
      return 'CV FILE NOT FOUND — place cv.pdf in the /public folder.';
    }
    window.open(profile.cvPath, '_blank', 'noopener');
    return null;
  } catch {
    return 'CV FILE UNREACHABLE — check your network connection.';
  }
}

/** Copy the contact email to clipboard. Returns true on success. */
export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(profile.email);
    return true;
  } catch {
    return false;
  }
}
