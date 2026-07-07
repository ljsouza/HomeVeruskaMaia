# Plano de Deployment — psicoafetiva.com.br
**Projeto:** Site da Psicóloga Veruska Martins Maia  
**Domínio:** psicoafetiva.com.br (registro.br)  
**Hospedagem:** Cloudflare Pages  
**Data:** Julho 2026  

---

## Visão Geral

O site é uma homepage estática de uma página (single-page) desenvolvida em HTML/CSS/JS puro, sem dependências de framework ou build step. Pode ser publicado diretamente no Cloudflare Pages arrastando a pasta de arquivos — zero configuração de servidor.

---

## Arquivos do Projeto

```
handoff_psicoafetiva/
├── README.md                        ← Este arquivo
├── site/
│   ├── index.html                   ← Homepage principal (exportada do design)
│   └── uploads/                     ← Fotos da Veruska (4 imagens JPG)
│       ├── 651012272_...n.jpg        ← Hero (foto em pé)
│       ├── 538118094_...n.jpg        ← Sobre (foto no sofá)
│       ├── 602925061_...n.jpg        ← Abordagem (P&B close)
│       └── 718648530_...n.jpg        ← Blog (foto lifestyle)
```

> **Atenção:** O arquivo `index.html` carrega fontes do Google Fonts via CDN — é necessário conexão com internet para renderizar com tipografia correta.

---

## Passo 1 — Exportar o Site do Editor

O design foi criado como Design Component (`.dc.html`) no ambiente de design. Para publicar:

1. Abrir o arquivo `Veruska Martins Maia.dc.html` no editor
2. Usar a ferramenta **"Save as standalone HTML"** para gerar um `index.html` autocontido (inline de fontes e assets — opcional, ver nota abaixo)
3. **OU** simplesmente copiar o arquivo `.dc.html` renomeado para `index.html` + pasta `uploads/` com as 4 fotos

### Opção recomendada para Cloudflare Pages
Usar a pasta com dois arquivos separados (`index.html` + `uploads/`), pois o Cloudflare Pages serve arquivos estáticos nativamente com CDN global — não há ganho em inlinar tudo.

---

## Passo 2 — Cloudflare Pages: Criação do Projeto

### 2.1 Criar conta/login
- Acesse: https://dash.cloudflare.com
- Faça login ou crie conta gratuita

### 2.2 Criar projeto Pages
```
Cloudflare Dashboard
  → Workers & Pages
  → Create
  → Pages
  → Upload assets (opção "Direct Upload" — sem Git necessário)
```

### 2.3 Upload dos arquivos
Fazer upload da pasta `site/` contendo:
- `index.html`
- Pasta `uploads/` com as 4 fotos

**Nome do projeto sugerido:** `psicoafetiva`  
Isso vai gerar a URL temporária: `psicoafetiva.pages.dev`

### 2.4 Verificar publicação
Acessar `https://psicoafetiva.pages.dev` e confirmar que o site carrega corretamente com todas as imagens.

---

## Passo 3 — Conectar o Domínio psicoafetiva.com.br

### 3.1 Adicionar domínio ao Cloudflare
```
Cloudflare Dashboard
  → Websites
  → Add a site
  → Digite: psicoafetiva.com.br
  → Plano: Free
  → Continue
```

O Cloudflare vai escanear os DNS atuais e exibir os registros encontrados. **Anote os 2 nameservers fornecidos**, ex.:
```
ns1.cloudflare.com
ns2.cloudflare.com
```
(os nomes reais serão diferentes — use os que o Cloudflare mostrar)

### 3.2 Alterar nameservers no registro.br
- Acesse: https://registro.br
- Login com CPF/CNPJ do titular
- Meus Domínios → `psicoafetiva.com.br` → Editar
- Em **Servidores DNS**, substituir pelos nameservers fornecidos pelo Cloudflare
- Salvar

> ⏱ **Propagação:** Pode levar de 1 a 48 horas, mas geralmente é menos de 1 hora.

### 3.3 Vincular domínio ao Pages
```
Cloudflare Dashboard
  → Workers & Pages
  → psicoafetiva (seu projeto)
  → Custom domains
  → Set up a custom domain
  → Digite: psicoafetiva.com.br
  → Continue
```

Repetir para o subdomínio www:
```
  → Set up a custom domain
  → Digite: www.psicoafetiva.com.br
```

O Cloudflare vai criar automaticamente os registros DNS necessários (CNAME apontando para `psicoafetiva.pages.dev`).

---

## Passo 4 — Configurar Redirecionamentos

### 4.1 www → raiz (ou raiz → www)
Recomendado: `www.psicoafetiva.com.br` redireciona para `psicoafetiva.com.br` (sem www).

Criar arquivo `_redirects` na raiz do projeto:
```
# _redirects
https://www.psicoafetiva.com.br/* https://psicoafetiva.com.br/:splat 301
```

Fazer novo upload incluindo este arquivo na pasta raiz junto com `index.html`.

### 4.2 HTTPS automático
O Cloudflare provisiona certificado SSL/TLS automaticamente — nenhuma ação necessária. O site já estará disponível em HTTPS.

---

## Passo 5 — Atualizar o Canonical no HTML

Após confirmar o domínio final, atualizar a meta tag canonical no `index.html`:

```html
<!-- Linha atual (trocar pelo domínio real): -->
<link rel="canonical" href="https://psiveruska.com.br/">

<!-- Substituir por: -->
<link rel="canonical" href="https://psicoafetiva.com.br/">
```

Também atualizar a meta `og:url` se existir.

---

## Passo 6 — Configurações de Performance no Cloudflare

Após publicação, ativar no painel:

```
Cloudflare Dashboard → psicoafetiva.com.br → Speed → Optimization
```

| Configuração | Ação |
|---|---|
| Auto Minify (HTML/CSS/JS) | Ativar |
| Brotli | Ativar |
| Early Hints | Ativar |
| Rocket Loader | **Manter desativado** (pode interferir com animações) |

```
→ Caching → Cache Rules
```
Criar regra para imagens com TTL longo (ex.: 30 dias):
```
(http.request.uri.path matches "^/uploads/")
→ Cache TTL: 2592000 (30 dias)
```

---

## Passo 7 — Validação Final (Checklist)

Após publicação completa, verificar:

- [ ] Site abre em `https://psicoafetiva.com.br` sem erros
- [ ] Site abre em `https://www.psicoafetiva.com.br` e redireciona para sem-www
- [ ] Cadeado HTTPS verde no navegador
- [ ] Todas as 4 imagens carregam corretamente
- [ ] Botões de WhatsApp abrem a conversa com mensagem pré-preenchida
- [ ] Link do Instagram abre `@psiveruska`
- [ ] Âncoras do menu (Sobre, Psicoterapia, Atendimento, Blog, Contato) funcionam
- [ ] Testar em mobile (iPhone e Android)
- [ ] Rodar auditoria no PageSpeed Insights: https://pagespeed.web.dev

---

## Informações do Site

| Campo | Valor |
|---|---|
| Nome | Veruska Martins Maia |
| Especialidade | Psicóloga especialista em relacionamentos |
| CRP | 08/9957 |
| Cidade | Maringá, PR |
| Atendimento | Presencial (Maringá) + Online (Brasil) |
| Plataforma online | Google Meet |
| WhatsApp | (44) 98821-8241 |
| Instagram | @psiveruska |
| Domínio | psicoafetiva.com.br |

---

## Atualizações Futuras

Para atualizar o site depois de publicado:

1. Fazer as alterações no editor de design
2. Exportar novo `index.html`
3. Cloudflare Pages → projeto → Deployments → **Upload** a nova versão
4. O Cloudflare faz o deploy em ~30 segundos com zero downtime

Não é necessário Git, CI/CD ou terminal para manutenções simples de conteúdo.

---

## Suporte

- Cloudflare Docs Pages: https://developers.cloudflare.com/pages
- Registro.br ajuda DNS: https://registro.br/ajuda
- PageSpeed Insights: https://pagespeed.web.dev
