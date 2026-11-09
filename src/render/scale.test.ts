import { describe, expect, it } from 'vitest';
import { integerScale } from './scale';

describe('integerScale', () => {
  it('picks the largest whole factor that still fits', () => {
    expect(integerScale(1280, 720)).toBe(3); // 3 * 240 = 720 fits, 4 * 240 = 960 does not
    expect(integerScale(256, 240)).toBe(1);
    expect(integerScale(512, 480)).toBe(2);
  });

  it('never scales below 1x, so the frame is never shrunk', () => {
    expect(integerScale(100, 50)).toBe(1);
    expect(integerScale(0, 0)).toBe(1);
  });

  it('is driven by height on a wide window, which is what letterboxes the sides', () => {
    expect(integerScale(4000, 480)).toBe(2);
  });
});
