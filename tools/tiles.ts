import { NES_INDEX, rgbOf } from '../src/render/palette.ts';

export const TILE_PX = 16;

const BLACK = rgbOf(NES_INDEX.black);
const RED = rgbOf(NES_INDEX.red);
const BROWN = rgbOf(NES_INDEX.brown);
const ORANGE = rgbOf(NES_INDEX.orange);
const GREEN_BRIGHT = rgbOf(NES_INDEX.greenBright);
const GREEN_DARK = rgbOf(NES_INDEX.greenDark);
const WHITE = rgbOf(NES_INDEX.white);

/**
 * A 16×16 RGB surface.
 *
 * The patterns below are our own rendering of shapes that are documented well enough to
 * reproduce from description — running-bond brick, a ? block with corner rivets, a two-tile
 * wide pipe. They are NOT verified pixel-for-pixel against the original art; that happens by
 * side-by-side comparison once the game draws them in place. Until then treat each entry as
 * "the shape is right, the exact pixels are provisional".
 */
class Surface {
  readonly data = new Uint8Array(TILE_PX * TILE_PX * 3);

  private write(x: number, y: number, hex: string): void {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    const i = (y * TILE_PX + x) * 3;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
  }

  fill(hex: string): void {
    for (let y = 0; y < TILE_PX; y += 1) for (let x = 0; x < TILE_PX; x += 1) this.write(x, y, hex);
  }

  rect(x: number, y: number, w: number, h: number, hex: string): void {
    for (let row = y; row < y + h; row += 1)
      for (let col = x; col < x + w; col += 1)
        if (col >= 0 && row >= 0 && col < TILE_PX && row < TILE_PX) this.write(col, row, hex);
  }

  /** Paint a glyph from a string grid where any non-space, non-dot character is on. */
  glyph(x: number, y: number, rows: readonly string[], hex: string): void {
    for (let row = 0; row < rows.length; row += 1) {
      const line = rows[row] ?? '';
      for (let col = 0; col < line.length; col += 1) {
        const ch = line[col];
        if (ch !== undefined && ch !== '.' && ch !== ' ') this.write(x + col, y + row, hex);
      }
    }
  }
}

const QUESTION_ROWS = ['..####..', '.##..##.', '##....#.', '....###.', '...##...', '...#....', '........', '...##...'];

export const TILE_PAINTERS: Readonly<Record<string, (s: Surface) => void>> = {
  ground: (s) => {
    s.fill(BROWN);
    s.rect(0, 0, TILE_PX, 1, WHITE);
    s.rect(0, 1, TILE_PX, 1, BROWN);
    for (let y = 3; y < TILE_PX; y += 4) {
      for (let x = 1; x < TILE_PX; x += 6) s.rect(x, y, 2, 2, BLACK);
    }
    s.rect(TILE_PX - 1, 1, 1, TILE_PX - 1, BLACK);
    s.rect(0, TILE_PX - 1, TILE_PX, 1, BLACK);
  },

  brick: (s) => {
    s.fill(BLACK);
    for (const [y, offset] of [
      [1, 0],
      [9, 8],
    ] as const) {
      s.rect(0, y, TILE_PX, 7, RED);
      for (let x = offset; x < TILE_PX; x += 8) s.rect(x, y, 1, 7, BLACK);
      s.rect(0, y, TILE_PX, 1, WHITE);
    }
  },

  questionBlock: (s) => {
    s.fill(ORANGE);
    s.rect(0, 0, TILE_PX, 1, BLACK);
    s.rect(0, TILE_PX - 1, TILE_PX, 1, BLACK);
    s.rect(0, 0, 1, TILE_PX, BLACK);
    s.rect(TILE_PX - 1, 0, 1, TILE_PX, BLACK);
    for (const [x, y] of [
      [2, 2],
      [13, 2],
      [2, 13],
      [13, 13],
    ] as const)
      s.rect(x, y, 1, 1, BLACK);
    s.glyph(4, 4, QUESTION_ROWS, BLACK);
  },

  /** A Question Block already hit: the same frame, no glyph. */
  questionBlockUsed: (s) => {
    s.fill(ORANGE);
    s.rect(0, 0, TILE_PX, 1, BLACK);
    s.rect(0, TILE_PX - 1, TILE_PX, 1, BLACK);
    s.rect(0, 0, 1, TILE_PX, BLACK);
    s.rect(TILE_PX - 1, 0, 1, TILE_PX, BLACK);
    for (const [x, y] of [
      [2, 2],
      [13, 2],
      [2, 13],
      [13, 13],
    ] as const)
      s.rect(x, y, 1, 1, BLACK);
  },

  hardBlock: (s) => {
    s.fill(ORANGE);
    s.rect(0, 0, TILE_PX, 1, BLACK);
    s.rect(0, TILE_PX - 1, TILE_PX, 1, BLACK);
    s.rect(0, 0, 1, TILE_PX, BLACK);
    s.rect(TILE_PX - 1, 0, 1, TILE_PX, BLACK);
    s.rect(2, 2, TILE_PX - 4, TILE_PX - 4, BLACK);
    s.rect(3, 3, TILE_PX - 6, TILE_PX - 6, ORANGE);
  },

  pipeTopLeft: (s) => {
    s.fill(GREEN_BRIGHT);
    s.rect(0, 0, 1, TILE_PX, BLACK);
    s.rect(0, 0, TILE_PX, 1, BLACK);
    s.rect(1, 1, 2, TILE_PX - 1, WHITE);
    s.rect(12, 4, TILE_PX - 12, TILE_PX - 4, GREEN_DARK);
    s.rect(0, 6, TILE_PX, 1, BLACK);
  },

  pipeTopRight: (s) => {
    s.fill(GREEN_BRIGHT);
    s.rect(TILE_PX - 1, 0, 1, TILE_PX, BLACK);
    s.rect(0, 0, TILE_PX, 1, BLACK);
    s.rect(2, 1, 2, TILE_PX - 1, WHITE);
    s.rect(12, 4, 3, TILE_PX - 4, GREEN_DARK);
    s.rect(0, 6, TILE_PX, 1, BLACK);
  },

  pipeShaftLeft: (s) => {
    s.fill(GREEN_BRIGHT);
    s.rect(0, 0, 1, TILE_PX, BLACK);
    s.rect(1, 0, 2, TILE_PX, WHITE);
    s.rect(12, 0, 4, TILE_PX, GREEN_DARK);
  },

  pipeShaftRight: (s) => {
    s.fill(GREEN_BRIGHT);
    s.rect(TILE_PX - 1, 0, 1, TILE_PX, BLACK);
    s.rect(2, 0, 2, TILE_PX, WHITE);
    s.rect(12, 0, 3, TILE_PX, GREEN_DARK);
  },
};

export type TileName = keyof typeof TILE_PAINTERS;

export function paintTile(name: string): Uint8Array {
  const painter = TILE_PAINTERS[name];
  if (!painter) throw new Error(`unknown tile "${name}"`);
  const surface = new Surface();
  painter(surface);
  return surface.data;
}
