/**
 * NES 2C02 colour table, plus the palette data the Reference Version itself writes.
 *
 * TWO KINDS OF DATA LIVE HERE AND THEY ARE NOT EQUALLY TRUSTWORTHY. Read before using.
 *
 * FIRM (from the game's own ROM code, threecreepio/smb-disassembly `src/smb.asm`):
 *   - `PPU_BACKGROUND_INDEX_OVERWORLD` — the overworld background is $22, taken from
 *     `BackgroundColors`, not from the universal colour slot. This settled a question that had
 *     looked like a contradiction: every palette group writes $0F as its universal colour, which
 *     made it look as though the sky had to be that colour.
 *   - `PPU_GROUPS_GROUND` — the raw PPU values written to $3F00-$3F1F, from `GroundPaletteData`,
 *     with the third group replaced by `Palette3Data`, which the game copies over the blank
 *     palette at runtime per area type.
 *
 * NOT FIRM: `NES_2C02` maps a PPU index to an RGB value. The values were taken verbatim from
 * `defaultPalette` in QuantumSoundings/BassNES, `BassNES.Core/src/core/video/NesColors.java`
 * line 18. Index alignment with the canonical 2C02 palette is UNVERIFIED, and one spot check
 * already failed: at the index the ROM says the sky is ($22) this table gives `#9d84ff`, a
 * lavender, while the sky in the game is plainly a medium blue. So the indices above are right
 * and this table is wrong, or at least reordered.
 *
 * Do not generate art that is meant to match the Reference Version from this table. Replace it
 * with a documented 2C02 table, or sample the colours from captured footage, then confirm the
 * sky index reads as a medium blue. `pending palette` in palette.test.ts tracks that gap.
 */
export const NES_2C02: readonly string[] = [
  '#606060', '#09268e', '#1a11bd', '#3409b6', '#5e0982', '#790939', '#6f0c09', '#511f09',
  '#293709', '#0d4809', '#094e09', '#094b17', '#093a5a', '#000000', '#000000', '#000000',
  '#b1b1b1', '#1658f7', '#4433ff', '#7d20ff', '#b515d8', '#cb1d73', '#c62922', '#954f09',
  '#5f7209', '#28ac09', '#099c09', '#099032', '#0976a2', '#090909', '#000000', '#000000',
  '#ffffff', '#5dadff', '#9d84ff', '#d76aff', '#ff5dff', '#ff63c6', '#ff8150', '#ffa50d',
  '#ccc409', '#74f009', '#54fc1c', '#33f881', '#3fd4ff', '#494949', '#000000', '#000000',
  '#ffffff', '#c8eaff', '#e1d8ff', '#ffccff', '#ffc6ff', '#ffcbfb', '#ffd7c2', '#ffe999',
  '#f0f986', '#d6ff90', '#bdffaf', '#b3ffd7', '#b3ffff', '#bcbcbc', '#000000', '#000000',
] as const;

/** PPU index used as the background colour for overworld areas. From `BackgroundColors`. */
export const PPU_BACKGROUND_INDEX_OVERWORLD = 0x22;

/**
 * PPU values written to $3F00-$3F1F for overworld play: four background groups then four sprite
 * groups, each [universal, colour1, colour2, colour3].
 *
 * The first, second and fourth background groups are as written by `GroundPaletteData`. The
 * third is the `Palette3Data` value for area type 0, which the game copies over the blank
 * palette at runtime; the `GroundPaletteData` value for that slot is never what reaches the PPU.
 */
export const PPU_GROUPS_GROUND: readonly (readonly [number, number, number, number])[] = [
  [0x0f, 0x29, 0x1a, 0x0f],
  [0x0f, 0x36, 0x17, 0x0f],
  [0x0f, 0x07, 0x12, 0x0f], // Palette3Data, area type 0
  [0x0f, 0x27, 0x17, 0x0f],
  // sprite groups
  [0x0f, 0x16, 0x27, 0x18],
  [0x0f, 0x1a, 0x30, 0x27],
  [0x0f, 0x16, 0x30, 0x27],
  [0x0f, 0x36, 0x17, 0x00],
] as const;

/**
 * Convenience names for indices the overworld data uses. The names describe the colour this
 * table gives them, which per the header is not yet confirmed — treat them as labels for
 * looking values up, not as statements about what is on screen.
 */
export const NES_INDEX = {
  black: 0x0f,
  red: 0x16,
  brown: 0x17,
  olive: 0x18,
  greenDark: 0x1a,
  blueLight: 0x21,
  orange: 0x27,
  greenBright: 0x29,
  white: 0x30,
  peach: 0x36,
} as const;

/** Hex string for a PPU index. Returns black for an index outside the table. */
export function rgbOf(index: number): string {
  return NES_2C02[index] ?? '#000000';
}
