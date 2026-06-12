import type { ReactNode } from 'react';

/**
 * Shared HUD container with sci-fi corner brackets.
 * Used by the navigation HUD and modal panels.
 */
export function HUDPanel({
  children,
  className = '',
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={`hud-panel ${className}`}>
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
      {title && <div className="hud-panel-title">{title}</div>}
      {children}
    </div>
  );
}
