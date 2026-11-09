import { describe, expect, it } from 'vitest';
import {
  NES_2C02,
  PPU_BACKGROUND_INDEX_OVERWORLD,
  PPU_GROUPS_GROUND,
  rgbOf,
} from './palette';

type RGB = { r: number; g: number; b: number };

function parse(hex: string): RGB {
  const value = Number.parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 0xff, g: (value >> 8) & 0xff, b: value & 0xff };
}

/**
 * The assertions here are only about what the Reference Version's own code says. The RGB table is
 * deliberately not asserted to be correct — see the header of palette.ts, where the failure that
 * shows it is written down.
 */
describe('PPU palette data from the Reference Version', () => {
  it('overworld background is $22, from BackgroundColors, not the universal slot', () => {
    expect(PPU_BACKGROUND_INDEX_OVERWORLD).toBe(0x22);
    expect(PPU_GROUPS_GROUND[0]?.[0]).toBe(0x0f); // universal is $0F for every group
  });

  it('is four background groups then four sprite groups', () => {
    expect(PPU_GROUPS_GROUND).toHaveLength(8);
    for (const group of PPU_GROUPS_GROUND) {
      expect(group).toHaveLength(4);
      for (const index of group) {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(64);
      }
    }
  });

  it('uses the Palette3Data value for background group 3, not GroundPaletteData', () => {
    // The game copies Palette3Data over the blank palette per area type at runtime, so this is
    // the value that actually reaches $3F0C-$3F0F in an overworld area.
    expect(PPU_GROUPS_GROUND[2]).toEqual([0x0f, 0x07, 0x12, 0x0f]);
  });
});

describe('NES RGB table (provisional)', () => {
  it('is a 64-entry table of plain hex colours', () => {
    expect(NES_2C02).toHaveLength(64);
    for (const hex of NES_2C02) expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('records the known-bad sky colour so a table swap forces a re-check', () => {
    // #9d84ff is a lavender. The game's sky is a medium blue. This assertion is here to fail the
    // moment someone replaces the table, so the swap comes with re-verifying blueness rather than
    // silently shipping whatever the new source happens to give.
    expect(rgbOf(PPU_BACKGROUND_INDEX_OVERWORLD)).toBe('#9d84ff');
  });

  it.skip('TODO: the sky index must resolve to a medium blue', () => {
    const sky = parse(rgbOf(PPU_BACKGROUND_INDEX_OVERWORLD));
    expect(sky.b).toBeGreaterThan(sky.r);
    expect(sky.b).toBeGreaterThan(sky.g);
    // Replace NES_2C02 with a documented 2C02 table, or sample colours from captured footage,
    // then unskip. Until then any generated art is wrong by construction.
  });
});
