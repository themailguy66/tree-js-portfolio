/**
 * Cyberpunk glitch text. Pure CSS animation (see screens.css),
 * automatically disabled by the prefers-reduced-motion media query.
 */
export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  );
}
