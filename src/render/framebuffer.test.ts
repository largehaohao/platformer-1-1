import { beforeAll, describe, expect, it } from 'vitest';
import { FRAMEBUFFER_HEIGHT, FRAMEBUFFER_WIDTH, PALETTE } from '../sim/constants';
import { Framebuffer } from './framebuffer';

/**
 * The node test environment has no ImageData. Polyfilling the minimum keeps the framebuffer
 * tests honest about byte layout without pulling a DOM emulator into the sim-core suite.
 */
class ImageDataStub {
  constructor(
    readonly data: Uint8ClampedArray,
    readonly width: number,
    readonly height: number,
  ) {}
}

beforeAll(() => {
  Object.defineProperty(globalThis, 'ImageData', { value: ImageDataStub, configurable: true });
});

function makeFramebuffer(): { fb: Framebuffer; blits: ImageDataStub[] } {
  const blits: ImageDataStub[] = [];
  const ctx = {
    putImageData: (image: ImageData) => {
      blits.push(image as unknown as ImageDataStub);
    },
  } as unknown as CanvasRenderingContext2D;
  return { fb: new Framebuffer(ctx), blits };
}

function byteAt(data: Uint8ClampedArray, x: number, y: number, channel: number): number {
  return data[(y * FRAMEBUFFER_WIDTH + x) * 4 + channel] ?? -1;
}

describe('Framebuffer', () => {
  it('is sized to the native frame', () => {
    const { fb } = makeFramebuffer();
    expect(fb.width).toBe(256);
    expect(fb.height).toBe(240);
    expect(fb.data.length).toBe(FRAMEBUFFER_WIDTH * FRAMEBUFFER_HEIGHT * 4);
  });

  it('writes palette bytes for a single pixel', () => {
    const { fb } = makeFramebuffer();
    fb.setPixel(10, 20, PALETTE.red);
    expect(byteAt(fb.data, 10, 20, 3)).toBe(255); // fully opaque
    expect(byteAt(fb.data, 10, 20, 0)).toBe(0xfc); // red channel of #FC0000
    expect(byteAt(fb.data, 10, 20, 1)).toBe(0x00);
  });

  it('ignores out-of-bounds pixels instead of writing past the buffer', () => {
    const { fb } = makeFramebuffer();
    fb.clear(PALETTE.black);
    fb.setPixel(-1, 0, PALETTE.white);
    fb.setPixel(0, -1, PALETTE.white);
    fb.setPixel(fb.width, 0, PALETTE.white);
    fb.setPixel(0, fb.height, PALETTE.white);
    expect(fb.data.every((b) => b === 0 || b === 255)).toBe(true);
    expect(byteAt(fb.data, 255, 239, 0)).toBe(0);
  });

  it('clears every pixel including alpha', () => {
    const { fb } = makeFramebuffer();
    fb.clear(PALETTE.sky);
    expect(fb.data.every((b, i) => (i % 4 === 3 ? b === 255 : true))).toBe(true);
    expect(byteAt(fb.data, 0, 0, 0)).toBe(0x00);
  });

  it('leaves the pixel untouched when the colour index is unknown', () => {
    const { fb } = makeFramebuffer();
    fb.setPixel(5, 5, PALETTE.green);
    fb.setPixel(5, 5, 99);
    expect(byteAt(fb.data, 5, 5, 1)).toBe(0xa8); // still green
  });
});
