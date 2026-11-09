import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from './png.ts';
import { TILE_PAINTERS, TILE_PX, paintTile } from './tiles.ts';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public', 'assets');

const names = Object.keys(TILE_PAINTERS).sort();
const columns = 4;
const rows = Math.ceil(names.length / columns);
const sheetWidth = columns * TILE_PX;
const sheetHeight = rows * TILE_PX;

const sheet = new Uint8Array(sheetWidth * sheetHeight * 3);
const atlas: {
  image: string;
  tileWidth: number;
  tileHeight: number;
  tiles: Record<string, { x: number; y: number }>;
} = { image: 'tiles.png', tileWidth: TILE_PX, tileHeight: TILE_PX, tiles: {} };

names.forEach((name, index) => {
  const col = index % columns;
  const row = Math.floor(index / columns);
  const tile = paintTile(name);
  for (let y = 0; y < TILE_PX; y += 1) {
    const dest = ((row * TILE_PX + y) * sheetWidth + col * TILE_PX) * 3;
    sheet.set(tile.subarray(y * TILE_PX * 3, (y + 1) * TILE_PX * 3), dest);
  }
  atlas.tiles[name] = { x: col * TILE_PX, y: row * TILE_PX };
});

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'tiles.png'), encodePng(sheetWidth, sheetHeight, sheet));
writeFileSync(join(outDir, 'tiles.atlas.json'), `${JSON.stringify(atlas, null, 2)}\n`);

console.log(`${names.length} tiles -> ${outDir}/tiles.png (${sheetWidth}x${sheetHeight})`);
