/* ─────────────────────────────────────────────────────────────
   PAC//MAN — board component
   Reducer-driven grid renderer with keyboard + touch controls.
   ───────────────────────────────────────────────────────────── */
import { useEffect, useReducer, useRef } from 'react';
import {
  GAME_STATUS,
  ITEM,
  TICK_MS,
  TOTAL_PELLETS,
  PELLET_SCORE,
  gameReducer,
  getInitialState,
  type Vec,
} from './game';

const KEY_DIRECTION: Record<string, Vec> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
};

function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

export function Pacman() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);
  const running = state.status === GAME_STATUS.Running;

  useInterval(() => dispatch({ type: 'TIMETICK' }), running ? TICK_MS : null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const direction = KEY_DIRECTION[e.key];
      if (direction) {
        e.preventDefault();
        dispatch({ type: 'MOVE', direction });
      } else if (e.key === 'r' || e.key === 'Enter') {
        dispatch({ type: 'RESTART' });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const eaten = state.score / PELLET_SCORE;
  const { position } = state.pacman;

  const cellClass = (x: number, y: number) => {
    if (position.x === x && position.y === y) return 'cell pacman';
    if (state.ghost.some((g) => g.x === x && g.y === y)) return 'cell ghost';
    if (state.level[y][x] === ITEM.Wall) return 'cell wall';
    if (state.level[y][x] === ITEM.Food) return 'cell food';
    return 'cell';
  };

  return (
    <div className="game">
      <div className="readout">
        <span>
          SCORE <strong>{String(state.score).padStart(4, '0')}</strong>
        </span>
        <span>
          PELLETS <strong>{eaten}/{TOTAL_PELLETS}</strong>
        </span>
        <span className={`status status-${state.status.toLowerCase()}`}>
          {state.status === GAME_STATUS.Running && '▶ RUNNING'}
          {state.status === GAME_STATUS.GameOver && '✖ SIGNAL LOST'}
          {state.status === GAME_STATUS.Done && '✔ SECTOR CLEARED'}
        </span>
      </div>

      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${state.level[0].length}, 1fr)` }}
        role="img"
        aria-label="Pacman maze"
      >
        {state.level.map((row, y) =>
          row.map((_, x) => <div key={`${y}-${x}`} className={cellClass(x, y)} />),
        )}
        {!running && (
          <div className="board-overlay">
            <div className="board-overlay-title">
              {state.status === GAME_STATUS.GameOver ? 'SIGNAL LOST' : 'SECTOR CLEARED'}
            </div>
            <button className="btn" onClick={() => dispatch({ type: 'RESTART' })}>
              ↻ REBOOT SECTOR
            </button>
          </div>
        )}
      </div>

      <div className="controls">
        <div className="hint">
          [←↑↓→] / [WASD] move &nbsp;·&nbsp; [R] reboot
        </div>
        <div className="dpad" aria-label="Touch controls">
          <button className="btn dpad-up" onClick={() => dispatch({ type: 'MOVE', direction: { x: 0, y: -1 } })}>▲</button>
          <button className="btn dpad-left" onClick={() => dispatch({ type: 'MOVE', direction: { x: -1, y: 0 } })}>◀</button>
          <button className="btn dpad-down" onClick={() => dispatch({ type: 'MOVE', direction: { x: 0, y: 1 } })}>▼</button>
          <button className="btn dpad-right" onClick={() => dispatch({ type: 'MOVE', direction: { x: 1, y: 0 } })}>▶</button>
        </div>
      </div>
    </div>
  );
}
