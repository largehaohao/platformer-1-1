import { describe, expect, it } from 'vitest';
import {
  JUMP_INDEX_THRESHOLDS,
  ROM_FRICTION,
  ROM_JUMP,
  ROM_MAX_X_SPEED,
  ROM_RUNNING_TICKS,
  decode_horizontal_speed,
  jump_index_for_speed,
} from './physics';

describe('horizontal speed decode', () => {
  it('treats the high nybble as whole pixels and the low nybble as sixteenths', () => {
    expect(decode_horizontal_speed(0x28)).toBe(2.5);
    expect(decode_horizontal_speed(0x18)).toBe(1.5);
    expect(decode_horizontal_speed(0x10)).toBe(1);
    expect(decode_horizontal_speed(0x08)).toBe(0.5);
    expect(decode_horizontal_speed(0x00)).toBe(0);
  });

  it('sign-extends the whole-pixel part but adds the fraction positively', () => {
    expect(decode_horizontal_speed(0xd8)).toBe(-2.5);
    expect(decode_horizontal_speed(0xe8)).toBe(-1.5);
    expect(decode_horizontal_speed(0xf0)).toBe(-1);
  });

  it('makes the two max-speed tables mirror each other once decoded', () => {
    // The check that shows the fraction does not carry the sign: paired entries land on equal
    // magnitudes. Decode the fraction sign the other way and this stops holding.
    const right = ROM_MAX_X_SPEED.right.map(decode_horizontal_speed);
    const left = ROM_MAX_X_SPEED.left.map(decode_horizontal_speed);
    expect(left.map(Math.abs)).toEqual(right);
    expect(right).toEqual([2.5, 1.5, 1]);
  });

  it('is not the naive byte-over-256 reading', () => {
    // $28 read as 40/256 is 0.156, about sixteen times too slow. This assertion exists because
    // that misreading is the obvious thing to try and produces a game that feels frozen.
    expect(decode_horizontal_speed(0x28)).not.toBeCloseTo(0x28 / 256, 5);
  });
});

describe('jump selection', () => {
  it('increments once per threshold reached, capped at 4', () => {
    expect(jump_index_for_speed(0x00)).toBe(0);
    expect(jump_index_for_speed(0x08)).toBe(0);
    expect(jump_index_for_speed(0x09)).toBe(1);
    expect(jump_index_for_speed(0x10)).toBe(2);
    expect(jump_index_for_speed(0x19)).toBe(3);
    expect(jump_index_for_speed(0x1c)).toBe(4);
    expect(jump_index_for_speed(0x28)).toBe(4);
  });

  it('has one jump entry per reachable index', () => {
    expect(JUMP_INDEX_THRESHOLDS).toHaveLength(4);
    for (const table of Object.values(ROM_JUMP)) expect(table).toHaveLength(5);
  });

  it('keeps vertical speed a plain signed byte, not nybble-split', () => {
    // $fc is -4 in two's complement; the nybble rule applies horizontally only.
    expect(ROM_JUMP.initial_y_speed[0]).toBe(0xfc);
    expect(ROM_JUMP.initial_y_speed.map((b) => (b > 0x7f ? b - 0x100 : b))).toEqual([
      -4, -4, -4, -5, -5,
    ]);
  });
});

describe('constants taken from the Reference Version', () => {
  it('keeps the three speed and friction entries', () => {
    expect(ROM_MAX_X_SPEED.left).toHaveLength(3);
    expect(ROM_MAX_X_SPEED.right).toHaveLength(3);
    expect(ROM_FRICTION).toHaveLength(3);
  });

  it('runs for a fixed number of ticks once B is held', () => {
    expect(ROM_RUNNING_TICKS).toBe(0x0a);
  });
});
