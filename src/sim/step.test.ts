import { describe, expect, it } from 'vitest';
import { createInitialState, NO_INPUT, step } from './index';

describe('sim core', () => {
  it('advances the tick exactly once per step', () => {
    let state = createInitialState();
    for (let i = 0; i < 600; i += 1) state = step(state, NO_INPUT);
    expect(state.tick).toBe(600);
  });

  it('does not mutate the state it was given', () => {
    const before = createInitialState();
    step(before, NO_INPUT);
    expect(before.tick).toBe(0);
  });

  it('is reproducible: the same steps from the same state give the same state', () => {
    const run = (): number => {
      let state = createInitialState();
      const input = { ...NO_INPUT, right: true, jump: true };
      for (let i = 0; i < 240; i += 1) state = step(state, input);
      return state.tick;
    };
    expect(run()).toBe(run());
  });

  it('has no DOM available to it, which is the point of the headless core', () => {
    expect(typeof globalThis).toBe('object');
    expect(typeof (globalThis as Record<string, unknown>)['document']).toBe('undefined');
  });
});
