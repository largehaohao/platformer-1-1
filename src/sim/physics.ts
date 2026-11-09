/**
 * Movement constants read out of the Reference Version's own code, not tuned.
 *
 * Source: threecreepio/smb-disassembly `src/smb.asm`, line numbers cited per value so anyone can
 * re-check them. Values are the raw bytes the game uses; `decode_horizontal_speed` and the
 * selection functions turn them into the numbers this simulation works with.
 *
 * Units: the game keeps position as [page:8][low:8] and speed as a byte split nybble-wise.
 *   high nybble = whole pixels per tick
 *   low  nybble = fractional, each step worth 16 of 256
 * so $28 means 2 + 8*16/256 = 2.5 pixels per tick. The fractional part is added without regard to
 * sign, so $d8 is -3 + 0.5 = -2.5, which makes the two max-speed tables symmetric — see
 * `decode_horizontal_speed`. A plain byte-value/256 reading of these tables is wrong by roughly
 * 16x, which is the trap here.
 */

/** Per-tick movement on a 60Hz grid, in pixels. */
export type PixelsPerTick = number;

/**
 * Signed nybble-split decode. `speed >> 4` gives whole pixels and is sign-extended when the high
 * nybble is $8 or above (`ora #%11110000`). The low nybble becomes the subpixel accumulator via
 * `asl` x4 and is then ADDED (`adc $01`) with no sign handling of its own, so the fraction always
 * moves in the positive direction.
 *
 * The consequence is that a limit of $d8 means -3 whole plus 0.5 fractional = -2.5, which makes
 * `ROM_MAX_X_SPEED` exactly symmetric with the right-hand table ($d8/$28 -> 2.5, $e8/$18 -> 1.5,
 * $f0/$10 -> 1.0). Reading the fraction as carrying the sign gives -3.5 and breaks that symmetry;
 * that is the mistake this decode used to make.
 */
export function decode_horizontal_speed(speed: number): PixelsPerTick {
  let whole = (speed >> 4) & 0x0f;
  if (whole >= 8) whole -= 16;
  return whole + (speed & 0x0f) / 16;
}

/**
 * Maximum horizontal speeds, `MaxLeftXSpdData` at smb.asm:5964 and `MaxRightXSpdData` at :5967.
 *
 * The names are the disassembly's. In `ImposeFriction` the left-moving branch clamps against
 * `MaximumRightSpeed` and the right-moving branch against `MaximumLeftSpeed`, so the labels do
 * not obviously describe which direction they bound — the asymmetry between $28 and $d8 is a fact
 * about the data, the direction it bounds is not settled by the names and must be confirmed by
 * observing the game.
 */
export const ROM_MAX_X_SPEED = {
  left: [0xd8, 0xe8, 0xf0],
  right: [0x28, 0x18, 0x10],
} as const;

/** `FrictionData` at smb.asm:5971 — per-tick subpixel adder applied when slowing down. */
export const ROM_FRICTION = [0xe4, 0x98, 0xd0] as const;

/**
 * Jump tables, indexed by a value derived from horizontal speed. `JumpMForceData` at :5952,
 * `FallMForceData` at :5955, `PlayerYSpdData` at :5958, `InitMForceData` at :5961.
 * Entries 5 and 6 are swim and whirlpool, out of scope for World 1-1's overworld.
 *
 * Vertical speed is a plain signed byte, not nybble-split: $fc is -4 pixels per tick.
 */
export const ROM_JUMP = {
  upward_force: [0x20, 0x20, 0x1e, 0x28, 0x28],
  fall_force: [0x70, 0x70, 0x60, 0x90, 0x90],
  initial_y_speed: [0xfc, 0xfc, 0xfc, 0xfb, 0xfb],
  initial_y_force: [0x00, 0x00, 0x00, 0x00, 0x00],
} as const;

/**
 * Which jump entry to use, from `InitInAirPhysics` at smb.asm:6033-6044: the index starts at 0 and
 * increments once for each threshold the absolute horizontal speed reaches. The range is 0-4.
 */
export const JUMP_INDEX_THRESHOLDS = [0x09, 0x10, 0x19, 0x1c] as const;

export function jump_index_for_speed(absolute_x_speed: number): number {
  let index = 0;
  for (const threshold of JUMP_INDEX_THRESHOLDS) if (absolute_x_speed >= threshold) index += 1;
  return index;
}

/** Default downward force written on level entry, `Entrance_GameTimerSetup` at smb.asm:2784. */
export const ROM_VERTICAL_FORCE_DOWN_DEFAULT = 0x28;

/**
 * Maximum downward speed while falling, set in `MovePlayerVertically` at smb.asm:7532
 * ("set maximum vertical speed here").
 */
export const ROM_MAX_FALL_SPEED = 0x04;

/**
 * The B button sets a countdown timer when held while pressing in the direction of travel; while
 * it is non-zero the game picks the faster movement entries. `X_Physics` at smb.asm:6092-6107.
 *
 * This settles the open question from the design session: the Reference Version does have a run
 * button, and it is B.
 */
export const ROM_RUNNING_TICKS = 0x0a;

export function b_button_runs(buttonB: boolean): boolean {
  return buttonB;
}
