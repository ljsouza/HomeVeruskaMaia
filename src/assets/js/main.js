/* Interações do site — vanilla JS, sem dependências. */
(function () {
  'use strict';

  var nav = document.getElementById('site-nav');
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  /* Fundo da navegação ao rolar */
  function onScroll() {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  if (toggle && links) {
    function closeMenu() {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
  }

  /* Reveal ao entrar na viewport */
  var revEls = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { el.classList.add('in'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revEls.forEach(function (el) { observer.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Entrada escalonada do hero */
  var heroEls = document.querySelectorAll('.hero-in');
  heroEls.forEach(function (el, i) {
    setTimeout(function () { el.classList.add('in'); }, 300 + i * 150);
  });

  /* Formulário de contato — enquanto o Web3Forms não está configurado,
     o envio cai para o WhatsApp com a mensagem preenchida. */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      var keyEl = form.querySelector('[name="access_key"]');
      var key = keyEl ? keyEl.value.trim() : '';
      var configured = key && key.indexOf('COLE') === -1 && key.length > 12;
      if (configured) return; // deixa enviar normalmente ao Web3Forms
      e.preventDefault();
      var v = function (n) { return form[n] ? form[n].value.trim() : ''; };
      var linhas = ['Olá, Veruska! Gostaria de agendar uma consulta.'];
      if (v('name')) linhas.push('Nome: ' + v('name'));
      if (v('phone')) linhas.push('Telefone: ' + v('phone'));
      if (v('message')) linhas.push('', v('message'));
      window.open('https://wa.me/5544988260081?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
  }
})();
