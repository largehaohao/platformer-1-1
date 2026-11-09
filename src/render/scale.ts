/// <reference lib="dom" />
import { FRAMEBUFFER_HEIGHT, FRAMEBUFFER_WIDTH } from '../sim/constants';

/**
 * The largest integer scale factor that still fits the given window.
 *
 * Integer is not a preference here: a non-integer factor resamples pixel edges and the
 * first thing a viewer notices in a pixel-art reproduction is mushy pixels. Anything
 * left over becomes letterbox, which is the honest trade.
 */
export function integerScale(availWidth: number, availHeight: number): number {
  const raw = Math.min(availWidth / FRAMEBUFFER_WIDTH, availHeight / FRAMEBUFFER_HEIGHT);
  return Math.max(1, Math.floor(raw));
}

/** Sizes the canvas element: backing store stays native, CSS scales it by a whole number. */
export function applyScale(canvas: HTMLCanvasElement, scale: number): void {
  canvas.width = FRAMEBUFFER_WIDTH;
  canvas.height = FRAMEBUFFER_HEIGHT;
  canvas.style.width = `${FRAMEBUFFER_WIDTH * scale}px`;
  canvas.style.height = `${FRAMEBUFFER_HEIGHT * scale}px`;
}
