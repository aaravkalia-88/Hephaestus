import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const assets = new Map([['/browser-check.mjs', ['browser-check.mjs', 'text/javascript']]]);
for (const version of ['before', 'after']) {
  for (const [file, type] of [['index.html', 'text/html'], ['app.mjs', 'text/javascript'], ['styles.css', 'text/css']]) {
    assets.set(`/${version}/${file === 'index.html' ? '' : file}`, [`fixtures/repair-${version}/${file}`, type]);
  }
}
const projects = ['Export report', 'Invite reviewer', 'Fix mobile menu'];
const scenarios = new Set(['success', 'slow', 'empty', 'error', 'malformed', 'markup', 'network']);

export function createFixtureServer() {
  return createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'none'; frame-ancestors 'none'");
    if (request.method !== 'GET') { response.writeHead(405, { Allow: 'GET' }).end(); return; }
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname === '/favicon.ico') { response.writeHead(204).end(); return; }
    if (url.pathname === '/api/projects') {
      const scenario = url.searchParams.get('scenario') || 'success';
      if (!scenarios.has(scenario)) { response.writeHead(400).end('Unknown fixture scenario'); return; }
      await new Promise(resolve => setTimeout(resolve, scenario === 'slow' ? 2500 : 150));
      if (response.destroyed) return;
      if (scenario === 'network') { response.destroy(); return; }
      const data = scenario === 'empty' ? [] : scenario === 'malformed' ? { unexpected: true }
        : scenario === 'markup' ? ['<b>Release review</b>'] : scenario === 'error' ? { error: 'Simulated failure' } : projects;
      response.writeHead(scenario === 'error' ? 500 : 200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(data));
      return;
    }
    const asset = assets.get(url.pathname);
    if (!asset) { response.writeHead(404).end('Not a public fixture asset'); return; }
    try {
      const content = await readFile(new URL(asset[0], import.meta.url));
      response.writeHead(200, { 'Content-Type': `${asset[1]}; charset=utf-8` });
      response.end(content);
    } catch { response.writeHead(404).end('Fixture asset unavailable'); }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createFixtureServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(4173, '127.0.0.1', () => console.log('Synthetic fixture: http://127.0.0.1:4173/before/ and /after/'));
}
