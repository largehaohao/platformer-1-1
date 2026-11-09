import type { GameState } from './state';
import type { InputSnapshot } from './input';

/**
 * Advance the simulation by exactly one tick.
 *
 * The movement constants are now pinned in `physics.ts`; what is missing is integration —
 * velocity, collision resolution and Stomp bounce land here once there is level geometry to
 * collide with, because a movement model verified against nothing is a guess with citations.
 */
export function step(state: GameState, _input: InputSnapshot): GameState {
  return { tick: state.tick + 1 };
}
