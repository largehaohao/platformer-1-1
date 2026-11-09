/**
 * Everything the simulation knows at one instant. The renderer reads this and never
 * writes it; tests construct it. Nothing in here may reference the DOM.
 */
export interface GameState {
  /** Ticks elapsed since the attempt started. Determinism check: equals number of steps taken. */
  readonly tick: number;
}

export function createInitialState(): GameState {
  return { tick: 0 };
}
