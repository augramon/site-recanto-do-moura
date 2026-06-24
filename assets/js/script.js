/* =========================================================
   RECANTO DO MOURA — interações
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Menu mobile ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha ao clicar num link do menu
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fecha ao redimensionar para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  /* ---------- Header compacto ao rolar ---------- */
  var header = document.querySelector('.site-header');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);

    // Link ativo conforme a rolagem
    var scrollPos = y + 120;
    var current = '';
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) current = sec.getAttribute('id');
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal (com stagger nos grupos) ---------- */
  // Imagens entram com "wipe"; demais elementos com leve subida + foco.
  var imgTargets = document.querySelectorAll('.sobre-image, .loc-map');
  var blockTargets = document.querySelectorAll(
    '.sobre-text, .review-card, .rating-hero, ' +
    '.ambiente-content, .loc-info, .horarios-box, .contato-card, .section-head'
  );
  imgTargets.forEach(function (el) { el.classList.add('reveal-img'); });
  blockTargets.forEach(function (el) { el.classList.add('reveal'); });

  // Atraso escalonado entre irmãos do mesmo grupo (sensação artesanal)
  ['.reviews-grid', '.contato-cards'].forEach(function (sel) {
    var group = document.querySelector(sel);
    if (!group) return;
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--reveal-delay', (i % 3) * 90 + 'ms');
    });
  });

  var allTargets = [];
  Array.prototype.push.apply(allTargets, imgTargets);
  Array.prototype.push.apply(allTargets, blockTargets);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    allTargets.forEach(function (el) { io.observe(el); });

    // Rede de seguranca: imagens (Sobre/Mapa) nunca podem ficar invisiveis.
    // Se o observer nao disparar por qualquer motivo, garante a exibicao.
    setTimeout(function () {
      imgTargets.forEach(function (el) { el.classList.add('visible'); });
    }, 1500);
  } else {
    allTargets.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Hero scroll-expand (a foto cresce com a rolagem) ----------
     Reimplementação em JS puro do efeito "scroll expansion hero".
     A rolagem é interceptada até a foto expandir totalmente; depois o
     site rola normalmente. Tipografia inalterada — só a foto e o título
     se movem. */
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var heroBg = document.getElementById('heroBg');
  var heroMedia = document.getElementById('heroMedia');
  var heroTitles = document.getElementById('heroTitles');
  var heroAfter = document.getElementById('heroAfter');
  var heroWord1 = document.getElementById('heroWord1');
  var heroWord2 = document.getElementById('heroWord2');
  var heroHint = document.getElementById('heroHint');

  if (heroMedia) {
    var progress = 0;            // 0 → 1
    var fullyExpanded = false;
    var touchStartY = 0;
    var isMobileHero = window.innerWidth < 768;

    function render() {
      var wRange = isMobileHero ? 620 : 1200;
      var hRange = isMobileHero ? 220 : 380;
      var slide = progress * (isMobileHero ? 42 : 38); // vw que os títulos se afastam

      heroMedia.style.width = (300 + progress * wRange) + 'px';
      heroMedia.style.height = (420 + progress * hRange) + 'px';

      if (heroBg) heroBg.style.opacity = (1 - progress).toFixed(3);

      if (heroTitles) heroTitles.style.opacity = Math.max(0, 1 - progress * 1.15).toFixed(3);
      if (heroWord1) heroWord1.style.transform = 'translateX(-' + slide + 'vw)';
      if (heroWord2) heroWord2.style.transform = 'translateX(' + slide + 'vw)';
      if (heroHint) heroHint.style.opacity = Math.max(0, 1 - progress * 4).toFixed(3);

      if (heroAfter) heroAfter.classList.toggle('is-visible', progress >= 1);
    }

    function setProgress(p) {
      progress = Math.min(Math.max(p, 0), 1);
      if (progress >= 1) fullyExpanded = true;
      render();
    }

    // Acessibilidade: sem hijack para quem prefere menos movimento — já entra expandido.
    if (prefersReduced) {
      setProgress(1);
    } else {
      var onWheel = function (e) {
        if (fullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
          fullyExpanded = false;            // volta a "encolher" ao subir no topo
          e.preventDefault();
          setProgress(progress - 0.05);
        } else if (!fullyExpanded) {
          e.preventDefault();
          setProgress(progress + e.deltaY * 0.0009);
        }
      };

      var onTouchStart = function (e) { touchStartY = e.touches[0].clientY; };

      var onTouchMove = function (e) {
        if (!touchStartY) return;
        var deltaY = touchStartY - e.touches[0].clientY;
        if (fullyExpanded && deltaY < -20 && window.scrollY <= 5) {
          fullyExpanded = false;
          e.preventDefault();
          setProgress(progress - 0.05);
        } else if (!fullyExpanded) {
          e.preventDefault();
          var factor = deltaY < 0 ? 0.008 : 0.005;
          setProgress(progress + deltaY * factor);
          touchStartY = e.touches[0].clientY;
        }
      };

      var onTouchEnd = function () { touchStartY = 0; };

      // Enquanto não expandiu, mantém a página travada no topo.
      var onScrollLock = function () { if (!fullyExpanded) window.scrollTo(0, 0); };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
      window.addEventListener('scroll', onScrollLock);

      window.addEventListener('resize', function () {
        isMobileHero = window.innerWidth < 768;
        render();
      });

      render();
    }
  }

  /* ---------- Seletor interativo do cardápio (acordeão de imagens) ---------- */
  var menuSelector = document.getElementById('menuSelector');
  if (menuSelector) {
    var options = Array.prototype.slice.call(menuSelector.querySelectorAll('.msel-option'));
    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    function activate(index) {
      options.forEach(function (opt, i) {
        opt.classList.toggle('is-active', i === index);
      });
    }

    options.forEach(function (opt, i) {
      opt.addEventListener('click', function () { activate(i); });
      if (canHover) {
        opt.addEventListener('mouseenter', function () { activate(i); });
      }
    });

    // Entrada escalonada (mesma cadência do componente original: 180ms por item).
    if (prefersReduced) {
      options.forEach(function (opt) { opt.classList.add('in'); });
    } else {
      options.forEach(function (opt, i) {
        setTimeout(function () { opt.classList.add('in'); }, 180 * i);
      });
    }
  }

  /* ---------- Ano atual no rodapé ---------- */
  var anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();
})();
