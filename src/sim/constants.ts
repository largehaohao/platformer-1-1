// Timing and geometry constants. The physics values are deliberately NOT here yet:
// before any movement code lands they must be pinned against the reference ROM's
// player-movement routine (see "Open facts" below), not tuned by feel.

/** The reference version runs at 60Hz. The simulation steps once per tick, no more, no less. */
export const TICKS_PER_SECOND = 60;

/** One simulation tick, in seconds. The accumulator advances by exactly this much. */
export const TICK_DURATION = 1 / TICKS_PER_SECOND;

/** NES composite output size, including the rows the reference version reserves for the HUD. */
export const FRAMEBUFFER_WIDTH = 256;
export const FRAMEBUFFER_HEIGHT = 240;

/** The smallest unit of level geometry. See GLOSSARY.md "Tile". */
export const TILE_SIZE = 16;

/** Rows reserved for the HUD at the top of the frame, per the Reference Version. */
export const HUD_ROWS = 16;

/**
 * NES 2C02 palette, locked. Sprites and tiles may only use entries from this table —
 * see the Accuracy entry in GLOSSARY.md.
 *
 * TODO(open fact): pin the exact hex values against a documented 2C02 palette table
 * before any sprite is generated. The values below are placeholders so that the render
 * path has something to draw; they are not the locked palette.
 */
export const NES_PALETTE: readonly string[] = [
  '#000000', // 00
  '#FFFFFF', // 01
  '#FC0000', // 02
  '#00A800', // 03
  '#0000FC', // 04
  '#00E8FC', // 05
  '#F8C000', // 06
];

export const PALETTE = {
  black: 0,
  white: 1,
  red: 2,
  green: 3,
  blue: 4,
  sky: 5,
  ground: 6,
} as const;
