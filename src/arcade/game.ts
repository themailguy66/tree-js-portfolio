/* ─────────────────────────────────────────────────────────────
   PAC//MAN — game core
   Adapted from palowski/react-pacman (MIT), ported to TypeScript
   with score tracking, buffered turns and a swap-collision check.
   ───────────────────────────────────────────────────────────── */

export const ITEM = {
  Playground: 0,
  Wall: 1,
  Food: 2,
  Pacman: 3, // level-plan marker only — playground below
  Ghost: 4, // level-plan marker only — food below
} as const;

export type Cell = (typeof ITEM)[keyof typeof ITEM];

export const GAME_STATUS = {
  Running: 'RUNNING',
  GameOver: 'GAMEOVER',
  Done: 'DONE',
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export interface Vec {
  x: number;
  y: number;
}

export interface Ghost extends Vec {
  isMoving: boolean;
}

export interface GameState {
  status: GameStatus;
  level: Cell[][];
  pacman: { position: Vec; direction: Vec; pending: Vec };
  ghost: Ghost[];
  score: number;
}

export type GameAction =
  | { type: 'RESTART' }
  | { type: 'MOVE'; direction: Vec }
  | { type: 'TIMETICK' };

export const TICK_MS = 300;
export const PELLET_SCORE = 10;

// prettier-ignore
const LEVEL: Cell[][] = [
  [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
  [ 1,3,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
  [ 1,2,1,1,1,2,1,1,1,2,1,2,1,1,1,4,1,1,1,2,1 ],
  [ 1,2,2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
  [ 1,1,1,2,1,1,2,1,2,1,1,1,2,1,1,2,1,2,1,2,1 ],
  [ 1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,1 ],
  [ 1,2,1,1,2,1,2,1,1,1,2,1,1,1,2,1,1,2,1,2,1 ],
  [ 1,2,1,1,2,1,2,1,2,2,2,2,2,1,2,2,2,2,2,2,1 ],
  [ 1,2,1,1,2,2,2,1,2,2,4,2,2,1,2,1,1,1,1,2,1 ],
  [ 1,2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,1,1,1,2,1 ],
  [ 1,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1 ],
  [ 1,1,1,2,1,1,2,1,1,1,1,1,1,1,2,1,2,1,2,1,1 ],
  [ 1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,4,2,2,1 ],
  [ 1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1 ],
  [ 1,2,2,2,2,2,2,4,2,2,1,2,2,2,2,2,2,2,2,2,1 ],
  [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
];

export function getInitialState(): GameState {
  const level: Cell[][] = [];
  const ghost: Ghost[] = [];
  let pacman: GameState['pacman'] = {
    position: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
    pending: { x: 0, y: 0 },
  };
  // Parse the level plan: lift Pacman/Ghost markers out into game
  // objects and leave the underlying terrain in the grid.
  for (let y = 0; y < LEVEL.length; y++) {
    level[y] = [];
    for (let x = 0; x < LEVEL[y].length; x++) {
      const item = LEVEL[y][x];
      if (item === ITEM.Ghost) {
        // alternate isMoving so the pack doesn't move in lockstep
        ghost.push({ x, y, isMoving: ghost.length % 2 === 0 });
        level[y][x] = ITEM.Food;
      } else if (item === ITEM.Pacman) {
        const d = { x: -1, y: 0 };
        pacman = { position: { x, y }, direction: d, pending: d };
        level[y][x] = ITEM.Playground;
      } else {
        level[y][x] = item;
      }
    }
  }
  return { status: GAME_STATUS.Running, level, pacman, ghost, score: 0 };
}

const isWall = (level: Cell[][], p: Vec) => level[p.y]?.[p.x] === ITEM.Wall;

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESTART':
      return getInitialState();

    case 'MOVE':
      // Buffer the turn — applied on the next tick where it's legal,
      // so a slightly-early keypress still takes the corner.
      return { ...state, pacman: { ...state.pacman, pending: action.direction } };

    case 'TIMETICK': {
      if (state.status !== GAME_STATUS.Running) return state;

      // 0. level completed?
      if (!state.level.some((row) => row.includes(ITEM.Food)))
        return { ...state, status: GAME_STATUS.Done };

      // 1. resolve direction: take the buffered turn if it's open,
      //    otherwise keep rolling in the current direction
      const { position, direction, pending } = state.pacman;
      const turned = { x: position.x + pending.x, y: position.y + pending.y };
      const newDirection = !isWall(state.level, turned) ? pending : direction;
      let newPosition = { x: position.x + newDirection.x, y: position.y + newDirection.y };
      if (isWall(state.level, newPosition)) newPosition = { ...position };

      // 2. move ghosts — greedy chase at half speed, x axis preferred
      const newGhost = state.ghost.map((g): Ghost => {
        if (!g.isMoving) return { ...g, isMoving: true };
        if (newPosition.x < g.x && !isWall(state.level, { x: g.x - 1, y: g.y }))
          return { x: g.x - 1, y: g.y, isMoving: false };
        if (newPosition.x > g.x && !isWall(state.level, { x: g.x + 1, y: g.y }))
          return { x: g.x + 1, y: g.y, isMoving: false };
        if (newPosition.y < g.y && !isWall(state.level, { x: g.x, y: g.y - 1 }))
          return { x: g.x, y: g.y - 1, isMoving: false };
        if (newPosition.y > g.y && !isWall(state.level, { x: g.x, y: g.y + 1 }))
          return { x: g.x, y: g.y + 1, isMoving: false };
        return { ...g, isMoving: false };
      });

      // 3. ghost collision — same cell, or swapped cells mid-move
      const caught = newGhost.some(
        (g, i) =>
          (g.x === newPosition.x && g.y === newPosition.y) ||
          (state.ghost[i].x === newPosition.x &&
            state.ghost[i].y === newPosition.y &&
            g.x === position.x &&
            g.y === position.y),
      );
      const pacman = { position: newPosition, direction: newDirection, pending };
      if (caught)
        return { ...state, pacman, ghost: newGhost, status: GAME_STATUS.GameOver };

      // 4. eat the pellet under the new position
      const ate = state.level[newPosition.y][newPosition.x] === ITEM.Food;
      const newLevel = state.level.map((row) => row.slice());
      newLevel[newPosition.y][newPosition.x] = ITEM.Playground;

      return {
        ...state,
        pacman,
        ghost: newGhost,
        level: newLevel,
        score: state.score + (ate ? PELLET_SCORE : 0),
      };
    }
  }
}

/** Total pellets in the level — used for the HUD progress readout. */
export const TOTAL_PELLETS = getInitialState()
  .level.flat()
  .filter((c) => c === ITEM.Food).length;
