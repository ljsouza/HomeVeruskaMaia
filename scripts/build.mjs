/**
 * Build do site estático multipágina.
 * - Copia fontes, gera ícones, OG image, manifest, robots, sitemap, _headers
 * - Envolve cada fragmento de src/pages/*.html no layout compartilhado
 * - Inlina CSS e JS em cada página (zero requests render-blocking)
 */
import sharp from 'sharp';
import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  SITE_URL, BRAND, nav, footer, waFloat, businessJsonLd, WA_URL, EMAIL, INSTAGRAM, WEB3FORMS_KEY,
} from './lib/site.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

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

/* ---- 2. Ícones -------------------------------------------------------- */
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
  <text x="80" y="286" fill="#C9A96E" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="4" style="text-transform:uppercase">PSICÓLOGA · CRP 08/09957</text>
  <text x="78" y="360" fill="#E8EDF5" font-family="Georgia, 'Times New Roman', serif" font-size="66" font-style="italic">Veruska Martins Maia</text>
  <text x="80" y="418" fill="#8A9BB8" font-family="Georgia, serif" font-size="26">Psicoterapia para adultos · Maringá/PR e Online</text>
</svg>`);
await sharp(heroCover)
  .composite([{ input: ogOverlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(DIST, 'assets', 'img', 'og-image.jpg'));
console.log('✓ OG image gerada');

/* ---- 4. Layout compartilhado ----------------------------------------- */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

const css = minifyCss(await readFile(join(SRC, 'assets', 'css', 'styles.css'), 'utf8'));
const js = await readFile(join(SRC, 'assets', 'js', 'main.js'), 'utf8');

function layout({ title, description, path, active, jsonld, bodyClass = '', extraHead = '', main }) {
  const canonical = SITE_URL + path;
  const ld = Array.isArray(jsonld) ? jsonld : [jsonld];
  const ldScripts = ld.filter(Boolean)
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="author" content="${BRAND}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0C1120">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:image" content="${SITE_URL}/assets/img/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${SITE_URL}/assets/img/og-image.jpg">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/dm-sans-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/playfair-display-latin-italic.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/playfair-display-latin.woff2" crossorigin>
  ${extraHead}
  <style>${css}</style>
  ${ldScripts}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  ${nav(active)}
  <main id="conteudo">
${main}
  </main>
  ${footer()}
  ${waFloat()}
  <script>${js}</script>
</body>
</html>`;
}

/* ---- 5. Páginas ------------------------------------------------------- */
// Tokens substituídos nos fragmentos de src/pages/*.html
function fill(html) {
  return html
    .replace(/%WA%/g, WA_URL)
    .replace(/%EMAIL%/g, EMAIL)
    .replace(/%INSTAGRAM%/g, INSTAGRAM)
    .replace(/%W3FKEY%/g, WEB3FORMS_KEY);
}

const PAGES = [
  {
    file: 'home.html',
    out: 'index.html',
    path: '/',
    active: 'home',
    title: 'Veruska Martins Maia — Psicóloga clínica em Maringá/PR e Online',
    description: 'Psicóloga clínica (CRP 08/09957) com mais de 20 anos de experiência. Psicoterapia para adultos, presencial em Maringá/PR e online para todo o Brasil. Agende sua consulta.',
    jsonld: [businessJsonLd()],
    extraHead: `<link rel="preload" as="image" type="image/avif" href="/assets/img/hero-768.avif" imagesrcset="/assets/img/hero-480.avif 480w, /assets/img/hero-768.avif 768w, /assets/img/hero-960.avif 960w" imagesizes="(max-width: 820px) 100vw, 54vw" fetchpriority="high">`,
  },
  {
    file: 'veruska.html',
    out: 'veruska/index.html',
    path: '/veruska/',
    active: 'veruska',
    title: 'Veruska Martins Maia — Psicóloga clínica | Trajetória e formação',
    description: 'Conheça a psicóloga Veruska Martins Maia (CRP 08/09957): mais de 20 anos de experiência clínica, com formações em terapia cognitivo-comportamental, psicanálise e terapia do esquema. Atendimento em Maringá/PR e online.',
    jsonld: [{
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Veruska Martins Maia',
      jobTitle: 'Psicóloga clínica',
      description: 'Psicóloga clínica (CRP 08/09957) com mais de 20 anos de experiência, atendendo adultos presencialmente em Maringá/PR e online.',
      url: SITE_URL + '/veruska/',
      image: SITE_URL + '/assets/img/og-image.jpg',
      knowsAbout: ['Relacionamentos', 'Ansiedade', 'Luto', 'Depressão', 'Autoestima', 'Autoconhecimento', 'Psicoterapia'],
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Unicesumar' },
        { '@type': 'CollegeOrUniversity', name: 'Universidade Estadual de Maringá (UEM)' },
      ],
      sameAs: [INSTAGRAM],
    }],
  },
  {
    file: 'agendar.html',
    out: 'agendar/index.html',
    path: '/agendar/',
    active: 'agendar',
    title: 'Agendar consulta — Veruska Martins Maia | Psicóloga em Maringá e Online',
    description: 'Agende sua consulta com a psicóloga Veruska Martins Maia. Atendimento presencial em Maringá/PR e online para todo o Brasil. Fale pelo WhatsApp, e-mail ou formulário.',
    jsonld: [businessJsonLd()],
  },
];

for (const p of PAGES) {
  const fragment = fill(await readFile(join(SRC, 'pages', p.file), 'utf8'));
  let html = layout({
    title: p.title, description: p.description, path: p.path, active: p.active,
    jsonld: p.jsonld, extraHead: p.extraHead || '', main: fragment,
  });
  html = html.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n');
  const outPath = join(DIST, p.out);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html);
}
console.log(`✓ ${PAGES.length} página(s) gerada(s)`);

/* ---- 6. Arquivos estáticos ------------------------------------------- */
const webmanifest = {
  name: 'Veruska Martins Maia — Psicóloga clínica',
  short_name: 'Psicoafetiva',
  description: 'Psicoterapia para adultos, presencial em Maringá/PR e online para todo o Brasil.',
  start_url: '/', display: 'standalone',
  background_color: '#0C1120', theme_color: '#0C1120', lang: 'pt-BR',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
  ],
};
await writeFile(join(DIST, 'site.webmanifest'), JSON.stringify(webmanifest, null, 2));

await writeFile(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url>
    <loc>${SITE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap);

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
console.log('✓ manifest, robots, sitemap, _headers');
console.log('\nBuild concluído → dist/');
