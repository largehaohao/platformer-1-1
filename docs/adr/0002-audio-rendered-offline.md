# Audio is rendered offline; the game only plays files

The game plays pre-rendered OGG/WAV tracks instead of synthesizing NES channels at runtime, even though it is a chiptune recreation. World 1-1's music in the Reference Version runs at a fixed tempo that does not respond to Mario's speed, so a runtime sequencer would buy no behavioural difference — only a synth engine to build and maintain.

## Considered Options

- **Runtime NES APU synthesis** (two pulse, one triangle, one noise channels): the purest route, but worthwhile only if music had to react to gameplay, which it does not here.
- **Third-party SMB audio rips**: fastest, but ships Nintendo's copyrighted recordings rather than our own rendering.

## Consequences

The note tables for Ground Theme and the sound effects live in this repo and are compiled to audio by a build-time script; the shipped game carries no music logic.
