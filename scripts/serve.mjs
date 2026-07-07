/** Servidor estático mínimo para preview de dist/ (uso local).
 *  Aplica Brotli/Gzip em recursos de texto para simular o Cloudflare. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.webmanifest', '.svg', '.xml', '.txt']);
const IMMUTABLE = new Set(['.woff2', '.avif', '.webp', '.jpg', '.png']);

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path === '/' || path.endsWith('/')) path += 'index.html';
    const filePath = join(DIST, normalize(path).replace(/^(\.\.[/\\])+/, ''));
    const ext = extname(filePath);
    let data = await readFile(filePath);

    const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' };
    if (IMMUTABLE.has(ext)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';

    const accept = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.has(ext)) {
      if (/\bbr\b/.test(accept)) {
        data = brotliCompressSync(data, { params: { [constants.BROTLI_PARAM_QUALITY]: 10 } });
        headers['Content-Encoding'] = 'br';
      } else if (/\bgzip\b/.test(accept)) {
        data = gzipSync(data, { level: 9 });
        headers['Content-Encoding'] = 'gzip';
      }
      headers['Vary'] = 'Accept-Encoding';
    }

    res.writeHead(200, headers);
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Preview em http://localhost:${PORT}`);
});
