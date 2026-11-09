/// <reference lib="dom" />
import { FRAMEBUFFER_HEIGHT, FRAMEBUFFER_WIDTH, NES_PALETTE } from '../sim/constants';

export type ColorIndex = number;

/** Palette entries pre-expanded to RGBA tuples so the inner draw loop does no parsing. */
const RGBA: readonly (readonly [number, number, number, number])[] = NES_PALETTE.map((hex) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff, 255] as const;
});

/**
 * A 256×240 CPU-side pixel buffer in the Reference Version's native resolution.
 *
 * The renderer draws into this at 1:1 and blits the whole thing to the canvas once per
 * frame. Upscaling happens later, purely as CSS sizing on an integer multiple — no
 * resampling anywhere in the pipeline.
 */
export class Framebuffer {
  readonly width = FRAMEBUFFER_WIDTH;
  readonly height = FRAMEBUFFER_HEIGHT;
  readonly data = new Uint8ClampedArray(FRAMEBUFFER_WIDTH * FRAMEBUFFER_HEIGHT * 4);
  private readonly image: ImageData;

  constructor(private readonly ctx: CanvasRenderingContext2D) {
    this.image = new ImageData(this.data, FRAMEBUFFER_WIDTH, FRAMEBUFFER_HEIGHT);
  }

  setPixel(x: number, y: number, color: ColorIndex): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const rgba = RGBA[color];
    if (!rgba) return;
    const i = (y * this.width + x) * 4;
    this.data[i] = rgba[0];
    this.data[i + 1] = rgba[1];
    this.data[i + 2] = rgba[2];
    this.data[i + 3] = rgba[3];
  }

  fillRect(x: number, y: number, w: number, h: number, color: ColorIndex): void {
    for (let row = y; row < y + h; row += 1) {
      for (let col = x; col < x + w; col += 1) this.setPixel(col, row, color);
    }
  }

  clear(color: ColorIndex): void {
    this.fillRect(0, 0, this.width, this.height, color);
  }

  blit(): void {
    this.ctx.putImageData(this.image, 0, 0);
  }
}
