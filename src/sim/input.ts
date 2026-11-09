/**
 * A one-tick input snapshot: plain data, no DOM event objects. The keyboard adapter
 * outside the sim turns real key state into this shape.
 *
 * `jump` maps to the reference version's A button; `buttonB` to its B button.
 *
 * TODO(open fact): what `buttonB` actually does in the Reference Version (run? throw
 * Fireball? both?) is still unverified. The name stays neutral on purpose so the sim
 * core does not bake in an assumption.
 */
export interface InputSnapshot {
  readonly left: boolean;
  readonly right: boolean;
  readonly jump: boolean;
  readonly buttonB: boolean;
}

export const NO_INPUT: InputSnapshot = {
  left: false,
  right: false,
  jump: false,
  buttonB: false,
};
