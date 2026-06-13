/**
 * The desk tablet's idle glass — an attract screen for SIGNAL//ARCADE.
 * The actual Pac-Man game runs full-screen in the <Arcade> overlay, which
 * the tablet opens when clicked; this is purely decorative.
 */
export function ArcadeScreen() {
  return (
    <div className="screen-body arcade-screen">
      <div className="arcade-attract" aria-hidden="true">
        <div className="arcade-attract-logo">
          PAC<span>//</span>MAN
        </div>
        <div className="arcade-attract-sub">SIGNAL//ARCADE · CABINET 01</div>
        <div className="arcade-attract-cta">▸ INSERT COIN</div>
      </div>
    </div>
  );
}
