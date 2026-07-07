/**
 * Build do site estático.
 * - Copia fontes variáveis (woff2) para dist/assets/fonts
 * - Gera favicon, ícones PWA, apple-touch-icon e og-image (via sharp)
 * - Gera robots.txt, sitemap.xml, site.webmanifest, _redirects, _headers
 * - Inlina CSS e JS dentro de dist/index.html (zero requests render-blocking)
 */
import sharp from 'sharp';
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');
const SITE_URL = 'https://psicoafetiva.com.br';

await mkdir(join(DIST, 'assets', 'fonts'), { recursive: true });
await mkdir(join(DIST, 'assets', 'img'), { recursive: true });

/* ---- 1. Fontes -------------------------------------------------------- */
const FONTS = [
  ['@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2', 'playfair-display-latin.woff2'],
  ['@fontsource-variable/playfair-display/files/playfair-display-latin-wght-italic.woff2', 'playfair-display-latin-italic.woff2'],
  ['@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2', 'dm-sans-latin.woff2'],
];
for (const [from, to] of FONTS) {
  await copyFile(join(ROOT, 'node_modules', from), join(DIST, 'assets', 'fonts', to));
}
console.log('✓ Fontes copiadas');

/* ---- 2. Ícones (favicon SVG + rasters via sharp) ---------------------- */
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0C1120"/>
  <path d="M27 30 L50 73 L73 30" fill="none" stroke="#C9A96E" stroke-width="9"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
await writeFile(join(DIST, 'favicon.svg'), iconSvg);
const iconBuf = Buffer.from(iconSvg);
await sharp(iconBuf).resize(180, 180).png().toFile(join(DIST, 'apple-touch-icon.png'));
await sharp(iconBuf).resize(192, 192).png().toFile(join(DIST, 'icon-192.png'));
await sharp(iconBuf).resize(512, 512).png().toFile(join(DIST, 'icon-512.png'));
console.log('✓ Ícones gerados');

/* ---- 3. OG image (1200×630) ------------------------------------------ */
const ogW = 1200, ogH = 630;
const heroCover = await sharp(join(ROOT, 'src-images', 'hero.jpg'))
  .resize(ogW, ogH, { fit: 'cover', position: 'top' })
  .toBuffer();
const ogOverlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="${ogH}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.30" stop-color="#0C1120"/>
      <stop offset="0.62" stop-color="#0C1120" stop-opacity="0.92"/>
      <stop offset="1" stop-color="#0C1120" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${ogW}" height="${ogH}" fill="url(#g)"/>
  <text x="80" y="286" fill="#C9A96E" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="4" style="text-transform:uppercase">PSICÓLOGA · PSICANALISTA · CRP 08/9957</text>
  <text x="78" y="360" fill="#E8EDF5" font-family="Georgia, 'Times New Roman', serif" font-size="66" font-style="italic">Veruska Martins Maia</text>
  <text x="80" y="418" fill="#8A9BB8" font-family="Georgia, serif" font-size="26">Atendimento psicanalítico · Maringá/PR e Online</text>
</svg>`);
await sharp(heroCover)
  .composite([{ input: ogOverlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(DIST, 'assets', 'img', 'og-image.jpg'));
console.log('✓ OG image gerada');

/* ---- 4. Arquivos estáticos ------------------------------------------- */
const webmanifest = {
  name: 'Veruska Martins Maia — Psicóloga e Psicanalista',
  short_name: 'Psicoafetiva',
  description: 'Atendimento psicanalítico presencial em Maringá/PR e online para todo o Brasil.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0C1120',
  theme_color: '#0C1120',
  lang: 'pt-BR',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
  ],
};
await writeFile(join(DIST, 'site.webmanifest'), JSON.stringify(webmanifest, null, 2));

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
await writeFile(join(DIST, 'robots.txt'), robots);

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap);

const redirects = `https://www.psicoafetiva.com.br/* https://psicoafetiva.com.br/:splat 301!\n`;
await writeFile(join(DIST, '_redirects'), redirects);

const headers = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/assets/img/*
  Cache-Control: public, max-age=2592000

/favicon.svg
  Cache-Control: public, max-age=604800
`;
await writeFile(join(DIST, '_headers'), headers);
console.log('✓ robots, sitemap, manifest, _redirects, _headers');

/* ---- 5. index.html com CSS/JS inline --------------------------------- */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')      // remove comentários
    .replace(/\s+/g, ' ')                    // colapsa espaços
    .replace(/\s*([{}:;,>])\s*/g, '$1')      // remove espaços ao redor de tokens
    .replace(/;}/g, '}')
    .trim();
}

let html = await readFile(join(SRC, 'index.html'), 'utf8');
const css = await readFile(join(SRC, 'assets', 'css', 'styles.css'), 'utf8');
const js = await readFile(join(SRC, 'assets', 'js', 'main.js'), 'utf8');

html = html.replace('/*__INLINE_CSS__*/', minifyCss(css));
html = html.replace('/*__INLINE_JS__*/', js);
// remove comentários HTML (preserva IE conditionals — não há aqui)
html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
html = html.replace(/\n\s*\n/g, '\n');

await writeFile(join(DIST, 'index.html'), html);
console.log('✓ dist/index.html gerado (CSS/JS inline)');
console.log('\nBuild concluído → dist/');
