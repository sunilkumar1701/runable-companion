/**
 * Generate minimal extension icons as valid PNGs using pure Node.js (no canvas).
 * Creates simple solid-color squares with a centered "R".
 * 
 * Run: node scripts/generate-icons.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { deflateSync } from 'zlib';
import { join } from 'path';

const iconsDir = join('public', 'icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// CRC32 lookup table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcData = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function createPng(size) {
  const bgR = 59, bgG = 43, bgB = 32; // #3b2b20
  const fgR = 255, fgG = 255, fgB = 255; // white

  // Create raw RGBA pixel data
  const rawData = Buffer.alloc(size * (1 + size * 4));
  
  const radius = Math.round(size * 0.18);
  
  // Simple bitmap "R" glyph definitions for different sizes
  const rGlyphs = {
    16: {
      offsetX: 4, offsetY: 3, width: 8, height: 10,
      bitmap: [
        0b11111100,
        0b11000110,
        0b11000110,
        0b11000110,
        0b11111100,
        0b11011000,
        0b11001100,
        0b11000110,
        0b11000110,
        0b11000011,
      ]
    },
    48: {
      offsetX: 13, offsetY: 10, width: 22, height: 28,
      bitmap: null // Will use scaled approach
    },
    128: {
      offsetX: 34, offsetY: 24, width: 60, height: 80,
      bitmap: null
    }
  };

  // For 48 and 128, use a simple scaling of the 16px glyph
  const baseGlyph = rGlyphs[16];

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (1 + size * 4);
    rawData[rowOffset] = 0; // filter: none

    for (let x = 0; x < size; x++) {
      const pixOffset = rowOffset + 1 + x * 4;
      
      // Rounded rectangle check
      let inside = true;
      if (x < radius && y < radius) {
        const dx = radius - x, dy = radius - y;
        inside = (dx * dx + dy * dy) <= radius * radius;
      } else if (x >= size - radius && y < radius) {
        const dx = x - (size - radius - 1), dy = radius - y;
        inside = (dx * dx + dy * dy) <= radius * radius;
      } else if (x < radius && y >= size - radius) {
        const dx = radius - x, dy = y - (size - radius - 1);
        inside = (dx * dx + dy * dy) <= radius * radius;
      } else if (x >= size - radius && y >= size - radius) {
        const dx = x - (size - radius - 1), dy = y - (size - radius - 1);
        inside = (dx * dx + dy * dy) <= radius * radius;
      }

      if (!inside) {
        rawData[pixOffset] = 0;
        rawData[pixOffset + 1] = 0;
        rawData[pixOffset + 2] = 0;
        rawData[pixOffset + 3] = 0;
        continue;
      }

      // Check if pixel is part of the R glyph
      let isGlyph = false;
      const glyph = rGlyphs[size]?.bitmap ? rGlyphs[size] : null;
      
      if (glyph) {
        const gx = x - glyph.offsetX;
        const gy = y - glyph.offsetY;
        if (gx >= 0 && gx < glyph.width && gy >= 0 && gy < glyph.height) {
          const byteIdx = gx >> 3;
          const bitIdx = 7 - (gx & 7);
          if (gy < glyph.bitmap.length) {
            isGlyph = !!(glyph.bitmap[gy] & (1 << bitIdx));
          }
        }
      } else {
        // Scale from base 16px glyph
        const scaleX = size / 16;
        const scaleY = size / 16;
        const gx = Math.floor((x - 0) / scaleX) - baseGlyph.offsetX;
        const gy = Math.floor((y - 0) / scaleY) - baseGlyph.offsetY;
        if (gx >= 0 && gx < 8 && gy >= 0 && gy < baseGlyph.bitmap.length) {
          const bitIdx = 7 - gx;
          isGlyph = !!(baseGlyph.bitmap[gy] & (1 << bitIdx));
        }
      }

      rawData[pixOffset] = isGlyph ? fgR : bgR;
      rawData[pixOffset + 1] = isGlyph ? fgG : bgG;
      rawData[pixOffset + 2] = isGlyph ? fgB : bgB;
      rawData[pixOffset + 3] = 255;
    }
  }

  const compressed = deflateSync(rawData);

  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

for (const size of [16, 48, 128]) {
  const png = createPng(size);
  const path = join(iconsDir, `icon${size}.png`);
  writeFileSync(path, png);
  console.log(`Created ${path} (${png.length} bytes)`);
}

console.log('Done! Icons generated.');

