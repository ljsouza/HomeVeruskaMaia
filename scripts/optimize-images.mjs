/**
 * Otimização de imagens: gera AVIF + WebP + JPG responsivos a partir de src-images/.
 * Saída em dist/assets/img/. Também emite dist/assets/img/manifest.json com as
 * dimensões intrínsecas para uso no HTML.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src-images');
const OUT = join(ROOT, 'dist', 'assets', 'img');

// Config por imagem: larguras alvo (limitadas à largura da origem).
const IMAGES = [
  { name: 'hero', widths: [480, 768, 960] },
  { name: 'sobre', widths: [420, 640, 840] },
  { name: 'abordagem', widths: [380, 640, 760] },
  { name: 'blog', widths: [400, 640, 800] },
  { name: 'psicoterapia', widths: [400, 640, 800] },
  { name: 'autoconhecimento', widths: [400, 640, 800] },
];

const QUALITY = { avif: 55, webp: 74, jpg: 78 };

await mkdir(OUT, { recursive: true });

for (const { name, widths } of IMAGES) {
  const input = join(SRC, `${name}.jpg`);
  const meta = await sharp(input).metadata();

  const targets = [...new Set(widths.filter((w) => w <= meta.width).concat(Math.min(meta.width, Math.max(...widths))))]
    .sort((a, b) => a - b);

  for (const w of targets) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: QUALITY.avif }).toFile(join(OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: QUALITY.webp }).toFile(join(OUT, `${name}-${w}.webp`));
    await base.clone().jpeg({ quality: QUALITY.jpg, mozjpeg: true, progressive: true }).toFile(join(OUT, `${name}-${w}.jpg`));
  }
  console.log(`✓ ${name}: ${targets.join(', ')} px  (origem ${meta.width}×${meta.height})`);
}

console.log('✓ Imagens otimizadas em dist/assets/img/');
