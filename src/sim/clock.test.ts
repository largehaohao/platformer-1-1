import { describe, expect, it } from 'vitest';
import { consumeTime, createClock, MAX_STEPS_PER_FRAME, TICK_DURATION, TICKS_PER_SECOND } from './index';

describe('fixed timestep clock', () => {
  it('steps once per tick and carries nothing when the delta is exact', () => {
    const { clock, steps } = consumeTime(createClock(), TICK_DURATION);
    expect(steps).toBe(1);
    expect(clock.remainder).toBeCloseTo(0, 12);
  });

  it('carries leftover time below one tick instead of dropping it', () => {
    const half = TICK_DURATION / 2;
    const first = consumeTime(createClock(), half);
    expect(first.steps).toBe(0);
    expect(first.clock.remainder).toBeCloseTo(half, 12);

    const second = consumeTime(first.clock, half);
    expect(second.steps).toBe(1);
    expect(second.clock.remainder).toBeCloseTo(0, 12);
  });

  it('never runs more than the cap, so a long stall cannot make a frame unbounded', () => {
    const { clock, steps } = consumeTime(createClock(), 10);
    expect(steps).toBe(MAX_STEPS_PER_FRAME);
    expect(clock.remainder).toBe(0);
  });

  it('produces the same step counts for the same sequence of deltas', () => {
    const deltas = [0.016, 0.017, 0.021, 0.014, 1 / 60, 0.03];
    const run = (): number[] => {
      let clock = createClock();
      const out: number[] = [];
      for (const d of deltas) {
        const next = consumeTime(clock, d);
        clock = next.clock;
        out.push(next.steps);
      }
      return out;
    };
    expect(run()).toEqual(run());
  });

  it('keeps 60Hz as the reference cadence', () => {
    expect(TICKS_PER_SECOND).toBe(60);
    expect(TICK_DURATION).toBeCloseTo(1 / 60, 12);
  });
});
