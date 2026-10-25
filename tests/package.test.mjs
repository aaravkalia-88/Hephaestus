import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

test('welcome README and host icons resolve inside a standalone skill installation', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hephaestus-package-'));
  const installed = join(dir, 'hephaestus');
  cpSync(fileURLToPath(new URL('../skills/hephaestus', import.meta.url)), installed, { recursive: true });
  try {
    const readme = readFileSync(join(installed, 'README.md'), 'utf8');
    const images = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]);
    assert.ok(images.length > 0, 'The welcome README must include a bundled image.');
    const metadata = readFileSync(join(installed, 'agents/openai.yaml'), 'utf8');
    const icons = ['icon_small', 'icon_large'].map(field => {
      const match = metadata.match(new RegExp(`^  ${field}: "([^"]+)"$`, 'm'));
      assert.ok(match, `Missing ${field} resource declaration.`);
      return match[1];
    });
    const original = readFileSync(new URL('../assets/hephaestus-logo.png', import.meta.url));
    for (const resource of [...images, ...icons]) {
      assert.equal(isAbsolute(resource), false, 'Installation must not depend on the source checkout path.');
      const path = resolve(installed, resource);
      assert.ok(!relative(installed, path).startsWith('..'), 'Resource must stay inside the installed skill.');
      const image = readFileSync(path);
      assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      assert.deepEqual(image, original, 'Preserve the existing logo.');
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
