# No game engine: hand-rolled fixed-timestep loop

We need Mario's movement to match the NES release closely enough that the same input produces the same trajectory, which means owning the fixed 60Hz simulation step, subpixel velocities, and collision resolution entirely. We decided to write the loop ourselves in TypeScript on Canvas2D rather than use Phaser, because Phaser's Arcade Physics owns those exact behaviours and working around it costs more than implementing them.

## Considered Options

- **Phaser**: would save sprite/audio/scaling plumbing, but its physics model is its own and would have to be overridden wholesale to hit the movement constants.
- **Rust + WASM**: cleaner simulation layer, but adds toolchain and debugging cost disproportionate to a one-level project.
- **Zero-build native ES modules**: loses TypeScript's type checking over the level and physics data, which is where the fidelity claims live.

## Consequences

Rendering and input sit behind thin adapters so the simulation can run headless; that is what makes input-replay assertions possible.
