import type { Framebuffer } from './framebuffer';
import {
  FRAMEBUFFER_HEIGHT,
  FRAMEBUFFER_WIDTH,
  HUD_ROWS,
  PALETTE,
  TILE_SIZE,
} from '../sim/constants';

/**
 * Placeholder frame: no Mario, no level, no assets yet.
 *
 * It exists to prove three things at once and make any regression visible without a
 * test framework — the framebuffer is really 1:1 pixel addressed, the HUD band and
 * ground sit where the Reference Version puts them, and the sim's tick is what drives
 * the screen rather than the wall clock. Replace with the level renderer once
 * `src/level/` has content.
 */
export function drawDebugFrame(fb: Framebuffer, tick: number): void {
  fb.clear(PALETTE.sky);

  // The HUD band, top 16 rows.
  fb.fillRect(0, 0, FRAMEBUFFER_WIDTH, HUD_ROWS, PALETTE.black);

  // Ground: two tile rows along the bottom.
  const groundTop = FRAMEBUFFER_HEIGHT - TILE_SIZE * 2;
  fb.fillRect(0, groundTop, FRAMEBUFFER_WIDTH, TILE_SIZE * 2, PALETTE.ground);

  // 16px checker ruler: at any integer scale these squares must measure exactly
  // 16 * scale device pixels, or the scaling path is broken.
  for (let ty = 0; ty < TILE_SIZE; ty += 4) {
    for (let tx = 0; tx < TILE_SIZE; tx += 4) {
      const on = (tx / 4 + ty / 4) % 2 === 0;
      fb.fillRect(tx, HUD_ROWS + ty, 4, 4, on ? PALETTE.white : PALETTE.black);
    }
  }

  // Tile-aligned scan marker: its position comes from the sim tick, so if the sim
  // stalls or double-steps the marker visibly stutters or jumps.
  const markerX = tick % FRAMEBUFFER_WIDTH;
  fb.fillRect(markerX, HUD_ROWS, 1, groundTop - HUD_ROWS, PALETTE.white);
}
