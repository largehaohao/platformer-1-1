import type { GameState } from './state';
import type { InputSnapshot } from './input';

/**
 * Advance the simulation by exactly one tick.
 *
 * Movement, collision and entity behaviour land here once the Reference Version's
 * player constants are pinned against its movement routine (see "Open facts" in the
 * session notes). Until then this only advances the clock, so the loop, the render
 * path and the replay harness can be built and tested without guessing at physics.
 */
export function step(state: GameState, _input: InputSnapshot): GameState {
  return { tick: state.tick + 1 };
}
