/// <reference lib="dom" />
import { createKeyboardInput } from './input/keyboard';
import { drawDebugFrame } from './render/debugPattern';
import { Framebuffer } from './render/framebuffer';
import { applyScale, integerScale } from './render/scale';
import { consumeTime, createClock, createInitialState, step } from './sim';

/**
 * Bootstrap only: build the canvas, wire the adapters, run the loop. No game logic — the
 * moment this file knows what a Goomba is, the layering has already failed.
 */
function main(): void {
  const canvas = document.getElementById('game');
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('#game canvas missing from index.html');

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.imageSmoothingEnabled = false;

  const framebuffer = new Framebuffer(ctx);
  const keyboard = createKeyboardInput(window);

  let state = createInitialState();
  let clock = createClock();

  const resize = (): void => {
    applyScale(canvas, integerScale(window.innerWidth, window.innerHeight));
  };
  window.addEventListener('resize', resize);
  resize();

  let lastTime = performance.now();

  const frame = (now: number): void => {
    const elapsedSeconds = (now - lastTime) / 1000;
    lastTime = now;

    const consumed = consumeTime(clock, elapsedSeconds);
    clock = consumed.clock;

    // One snapshot per frame, reused for every step in it. Input arrives at display rate,
    // not tick rate; the replay harness feeds per-tick snapshots directly instead.
    const snapshot = keyboard.read();
    for (let i = 0; i < consumed.steps; i += 1) state = step(state, snapshot);

    drawDebugFrame(framebuffer, state.tick);
    framebuffer.blit();

    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

main();
