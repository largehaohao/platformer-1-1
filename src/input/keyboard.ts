/// <reference lib="dom" />
import type { InputSnapshot } from '../sim';

export interface InputHandle {
  /** Snapshot for the current tick. The sim takes a copy-on-read view; it never holds the handle. */
  read(): InputSnapshot;
  dispose(): void;
}

/**
 * Key mapping per the agreed layout: arrows or A/D move, Space/Z is the A button, X/J is the
 * B button. The B button's in-game role is still an open fact; this adapter only maps keys,
 * so pinning that fact later does not touch this file.
 */
const KEY_MAP: Readonly<Record<string, keyof MutableInput>> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'jump',
  KeyZ: 'jump',
  KeyX: 'buttonB',
  KeyJ: 'buttonB',
};

type MutableInput = {
  left: boolean;
  right: boolean;
  jump: boolean;
  buttonB: boolean;
};

export function createKeyboardInput(target: Window = window): InputHandle {
  const held: MutableInput = { left: false, right: false, jump: false, buttonB: false };

  const handle = (event: KeyboardEvent, down: boolean): void => {
    const field = KEY_MAP[event.code];
    if (!field) return;
    // Space and the arrows scroll the page; the game owns them.
    if (event.code === 'Space' || event.code.startsWith('Arrow')) event.preventDefault();
    held[field] = down;
  };

  const onKeyDown = (event: KeyboardEvent): void => handle(event, true);
  const onKeyUp = (event: KeyboardEvent): void => handle(event, false);

  target.addEventListener('keydown', onKeyDown);
  target.addEventListener('keyup', onKeyUp);

  return {
    read: () => ({ ...held }),
    dispose: () => {
      target.removeEventListener('keydown', onKeyDown);
      target.removeEventListener('keyup', onKeyUp);
    },
  };
}
