# platformer-1-1

A recreation of World 1-1 of the 1985 NES release of a certain Italian plumber's platform debut: same look, same sound, same feel, one level, nothing else. See `GLOSSARY.md` for the vocabulary and `docs/adr/` for the decisions that would otherwise look arbitrary.

**Controls:** arrows or A/D to move, Space or Z to jump, X or J for the B button.

```
pnpm install
pnpm dev    # play
pnpm test   # simulation core tests, no browser
pnpm build  # typecheck + bundle for GitHub Pages
```

Right now the build boots a 256×240 fixed-timestep loop rendering a debug pattern; Mario, the level and the audio come next.
