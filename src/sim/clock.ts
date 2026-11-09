import { TICK_DURATION } from './constants';

/**
 * Turns an arbitrary wall-clock delta into a whole number of simulation ticks.
 *
 * Lives in the sim package rather than in the browser bootstrap because it is part of the
 * determinism story: "same input produces the same trajectory" only means something if the
 * tick count is reproducible, and this is the piece that decides the tick count.
 *
 * Leftover time below one tick is carried in `remainder` rather than dropped, so long runs
 * do not drift relative to the reference version's 60Hz.
 */
export interface ClockState {
  readonly remainder: number;
}

/**
 * Frames whose backlog exceeds this are dropped instead of caught up. Without it, a stall
 * (backgrounded tab, devtools breakpoint) would make the sim chase reality at full cost and
 * the frame would never finish — the spiral of death.
 */
export const MAX_STEPS_PER_FRAME = 5;

export function createClock(): ClockState {
  return { remainder: 0 };
}

export function consumeTime(
  clock: ClockState,
  elapsedSeconds: number,
): { clock: ClockState; steps: number } {
  const elapsed = Math.max(0, elapsedSeconds);
  let accumulator = clock.remainder + elapsed;
  let steps = 0;

  while (accumulator >= TICK_DURATION && steps < MAX_STEPS_PER_FRAME) {
    accumulator -= TICK_DURATION;
    steps += 1;
  }

  if (steps === MAX_STEPS_PER_FRAME && accumulator >= TICK_DURATION) {
    // Backlog still exceeds one tick after the cap: abandon it rather than defer it.
    accumulator = 0;
  }

  return { clock: { remainder: accumulator }, steps };
}
