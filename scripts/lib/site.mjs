/* Dados e componentes compartilhados entre as páginas do site. */

export const SITE_URL = 'https://psicologaveruskamartins.com.br';
export const BRAND = 'Veruska Martins Maia';
export const CRP = '08/09957';

export const WHATSAPP = '5544988260081'; // 44 98826-0081
export const WA_TEXT = 'Ol%C3%A1%2C%20Veruska!%20Gostaria%20de%20agendar%20uma%20consulta.';
export const WA_URL = `https://wa.me/${WHATSAPP}?text=${WA_TEXT}`;
export const EMAIL = 'psicologaveruskamartins@gmail.com';
// Chave do Web3Forms (deixar vazio até gerar em web3forms.com com o e-mail acima).
// Enquanto vazia, o formulário faz fallback para o WhatsApp automaticamente.
export const WEB3FORMS_KEY = '';
export const INSTAGRAM = 'https://www.instagram.com/psiveruska';
export const ADDRESS = {
  street: 'Rua Neo Alves Martins, 2999 — Sala 124',
  district: 'Zona 1',
  city: 'Maringá',
  region: 'PR',
  zip: '87013-060',
};

/* ---- SVGs reutilizáveis ------------------------------------------------- */
export const ICON = {
  whatsapp: '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  instagram: '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  arrow: '<svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};

/* ---- Navegação (Fase 1: Início, Veruska, Agendar) ---------------------- */
export function nav(active = '') {
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `
  <header class="site-nav" id="site-nav">
    <a href="/" class="brand">
      <span class="brand__name">${BRAND}</span>
      <span class="brand__tag">Psicóloga · CRP ${CRP}</span>
    </a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-links">
      <span></span><span></span><span></span>
    </button>
    <nav class="nav-links" id="nav-links" aria-label="Navegação principal">
      ${link('/', 'Início', 'home')}
      ${link('/veruska/', 'Veruska', 'veruska')}
      ${link('/para-compreender/', 'Para compreender', 'compreender')}
      ${link('/agendar/', 'Agendar consulta', 'agendar')}
    </nav>
  </header>`;
}

/* ---- Rodapé ------------------------------------------------------------- */
export function footer() {
  return `
  <footer class="footer">
    <div class="footer__grid">
      <div class="footer__col">
        <div>
          <div class="footer__brand-name">${BRAND}</div>
          <div class="footer__brand-tag">Psicóloga · CRP ${CRP}</div>
        </div>
        <p>Atendimento presencial em Maringá — PR<br>e online para todo o Brasil.</p>
        <p class="italic">Sigilo, ética e acolhimento em cada sessão.</p>
      </div>
      <nav class="footer__col" aria-label="Navegação do rodapé">
        <span class="footer__label">Navegação</span>
        <a href="/">Início</a>
        <a href="/veruska/">Veruska</a>
        <a href="/agendar/">Agendar consulta</a>
      </nav>
      <div class="footer__col">
        <span class="footer__label">Contato</span>
        <a href="${WA_URL}" target="_blank" rel="noopener">${ICON.whatsapp} WhatsApp (44) 98826-0081</a>
        <a href="mailto:${EMAIL}">${EMAIL}</a>
        <a href="${INSTAGRAM}" target="_blank" rel="noopener">${ICON.instagram} @psiveruska</a>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${BRAND}. Todos os direitos reservados.</span>
      <span>Maringá, PR · Atendimento online para todo o Brasil</span>
    </div>
  </footer>`;
}

/* ---- WhatsApp flutuante ------------------------------------------------- */
export function waFloat() {
  return `<a class="wa-float" href="${WA_URL}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <svg class="icon" width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>`;
}

/* ---- JSON-LD do negócio (Psychologist) --------------------------------- */
export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Psychologist',
    name: BRAND,
    description: 'Psicóloga clínica (CRP 08/09957) com mais de 20 anos de experiência. Atendimento psicológico para adultos, presencial em Maringá/PR e online para todo o Brasil.',
    url: SITE_URL + '/',
    image: SITE_URL + '/assets/img/og-image.jpg',
    telephone: '+55-44-98826-0081',
    email: EMAIL,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Neo Alves Martins, 2999, Sala 124',
      addressLocality: 'Maringá',
      addressRegion: 'PR',
      postalCode: '87013-060',
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'City', name: 'Maringá' },
      { '@type': 'Country', name: 'Brasil' },
    ],
    knowsAbout: ['Relacionamentos', 'Ansiedade', 'Luto', 'Depressão', 'Autoestima', 'Autoconhecimento', 'Psicoterapia'],
    sameAs: [INSTAGRAM],
    availableService: [
      { '@type': 'Service', name: 'Psicoterapia presencial', areaServed: 'Maringá, PR' },
      { '@type': 'Service', name: 'Psicoterapia online', areaServed: 'Brasil' },
    ],
  };
}
