# psicoafetiva.com.br — Veruska Martins Maia

Site institucional estático da psicóloga e psicanalista Veruska Martins Maia
(CRP 08/9957). HTML/CSS/JS puro, sem framework, com build de otimização em
Node — pensado para **Lighthouse 100** e publicação no **Cloudflare Pages**.

## Stack

- **Fonte única de verdade:** `src/` (HTML) + `src/assets/` (CSS/JS) + `src-images/` (fotos originais)
- **Build (`scripts/`):** otimização de imagens (AVIF/WebP/JPG responsivos via `sharp`),
  inline de CSS/JS no HTML, geração de ícones, OG image, `robots.txt`, `sitemap.xml`,
  `site.webmanifest` e `_headers`
- **Saída:** `dist/` (é o que o Cloudflare publica) — não versionado

## Comandos

```bash
npm install        # instala sharp + fontes (@fontsource-variable)
npm run build      # gera dist/ completo (imagens + site)
npm run serve      # serve dist/ em http://localhost:4321 (com Brotli/Gzip)
npm run dev        # build + serve
```

## Estrutura

```
src/
  index.html               ← markup semântico (marcadores /*__INLINE_CSS__*/ e /*__INLINE_JS__*/)
  assets/css/styles.css    ← estilos (viram <style> inline no build)
  assets/js/main.js         ← nav, menu mobile, reveal (vira <script> inline)
src-images/                ← 4 fotos originais (hero, sobre, abordagem, blog)
scripts/
  optimize-images.mjs      ← AVIF/WebP/JPG em múltiplas larguras
  build.mjs                ← inline + assets + arquivos de deploy
  serve.mjs                ← preview local com compressão
dist/                      ← build final publicável (gerado)
```

## Otimizações para Lighthouse 100

- CSS e JS **inline** no HTML → zero requisições render-blocking
- Fontes **self-hosted** (woff2 variável), com `preload` e `font-display: swap`
- Imagens em **AVIF + WebP + JPG** responsivos (`<picture>` + `srcset`/`sizes`)
- Imagem LCP (hero) com `preload` + `fetchpriority="high"`
- `width`/`height` em todas as imagens → **CLS 0**
- JSON-LD (`Psychologist`), `robots.txt`, `sitemap.xml`, canonical, Open Graph
- Contraste de cores **AA** em todos os textos
- `prefers-reduced-motion` respeitado

## Deploy — Cloudflare Pages (via GitHub)

Repositório: `github.com/ljsouza/HomeVeruskaMaia`

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → selecionar `HomeVeruskaMaia`
2. Configuração de build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 ou superior (variável `NODE_VERSION=20` se necessário)
3. Deploy. Cada `git push` na branch `main` republica automaticamente.
4. **Custom domains:** adicionar `psicoafetiva.com.br` e `www.psicoafetiva.com.br`
   (o `www` → raiz é feito por uma Redirect Rule no nível da zona, pois o
   `_redirects` do Cloudflare não redireciona por hostname).

Detalhes de DNS (registro.br → nameservers Cloudflare) em
[`handoff_psicoafetiva/README.md`](handoff_psicoafetiva/README.md).

## Editar conteúdo

Textos e imagens ficam em `src/index.html` e `src-images/`. Após editar:
`npm run build` e `git push` (o Cloudflare republica sozinho).
