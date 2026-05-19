import { mkdir, open } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const outputPath = resolve('public/speed-test.bin');
const sizeBytes = 10 * 1024 * 1024;
const chunkSize = 1024 * 1024;

await mkdir(dirname(outputPath), { recursive: true });

const file = await open(outputPath, 'w');
try {
  const chunk = Buffer.alloc(chunkSize);
  for (let offset = 0; offset < chunk.length; offset += 1) {
    chunk[offset] = offset % 251;
  }

  for (let written = 0; written < sizeBytes; written += chunkSize) {
    await file.write(chunk, 0, Math.min(chunkSize, sizeBytes - written));
  }
} finally {
  await file.close();
}

console.log(`Generated ${outputPath} (${sizeBytes} bytes)`);
