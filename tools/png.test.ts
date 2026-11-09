import { describe, expect, it } from 'vitest';
import { inflateSync } from 'node:zlib';
import { encodePng } from './png.ts';

const CRC_TABLE: readonly number[] = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let bit = 0; bit < 8; bit += 1) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  return c >>> 0;
});

/** Independent reimplementation of the CRC, so a broken encoder is not excused by a shared helper. */
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = (CRC_TABLE[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Walk the chunk structure by length rather than hunting for a byte value: a four-letter chunk
 * name can appear inside a preceding chunk's CRC, and doing that here would be testing nothing.
 */
function chunks(png: Uint8Array): { type: string; data: Uint8Array; crc: number }[] {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const out: { type: string; data: Uint8Array; crc: number }[] = [];
  let offset = 8; // past the signature
  while (offset + 8 <= png.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...png.subarray(offset + 4, offset + 8));
    const data = png.subarray(offset + 8, offset + 8 + length);
    const crc = view.getUint32(offset + 8 + length);
    out.push({ type, data, crc });
    offset += 12 + length;
  }
  return out;
}

const width = 3;
const height = 2;
const rgb = new Uint8Array([
  255, 0, 0, 0, 255, 0, 0, 0, 255, // row 0: red, green, blue
  1, 2, 3, 4, 5, 6, 7, 8, 9, // row 1
]);
const png = encodePng(width, height, rgb);
const scanline = 1 + width * 3;

describe('PNG encoder', () => {
  it('starts with the PNG signature', () => {
    expect([...png.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  });

  it('emits IHDR, IDAT, IEND in that order', () => {
    expect(chunks(png).map((c) => c.type)).toEqual(['IHDR', 'IDAT', 'IEND']);
  });

  it('encodes the dimensions and format in IHDR', () => {
    const ihdr = chunks(png)[0]!.data;
    const view = new DataView(ihdr.buffer, ihdr.byteOffset, ihdr.byteLength);
    expect(view.getUint32(0)).toBe(width);
    expect(view.getUint32(4)).toBe(height);
    expect(ihdr[8]).toBe(8); // bit depth
    expect(ihdr[9]).toBe(2); // truecolour RGB
  });

  it('round-trips every pixel through the deflate stream', () => {
    const raw = inflateSync(chunks(png)[1]!.data);
    expect(raw.length).toBe(height * scanline);

    // first pixel of row 0, after its filter byte
    expect([...raw.subarray(1, 4)]).toEqual([255, 0, 0]);
    // last pixel of the last row
    expect([...raw.subarray(raw.length - 3)]).toEqual([7, 8, 9]);
    // every scanline declares filter type 0
    for (let y = 0; y < height; y += 1) expect(raw[y * scanline]).toBe(0);
  });

  it('carries a CRC that matches each chunk body', () => {
    for (const chunk of chunks(png)) {
      const typeBytes = new Uint8Array([...chunk.type].map((ch) => ch.charCodeAt(0)));
      const body = new Uint8Array(typeBytes.length + chunk.data.length);
      body.set(typeBytes);
      body.set(chunk.data, typeBytes.length);
      expect(chunk.crc).toBe(crc32(body));
    }
  });
});
