/* DOGE REBORN — GSAP Animations & Scroll Effects */
function initAnimations(lenis) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('[class*="reveal"]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    return;
  }

  /* If GSAP/ScrollTrigger failed to load, reveal everything so content is never stuck hidden */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('[class*="reveal"]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Sync Lenis with ScrollTrigger */
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- Page reveal after load ---- */
  gsap.from('body', {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.2,
  });

  /* ---- Hero entrance timeline ---- */
  /* On mobile the hero is a single centred column, so the mascot must rise &
     fade in (no horizontal slide) to stay perfectly centred. Desktop keeps its
     original slide-in from the right. */
  var heroIsMobile = window.matchMedia('(max-width: 899px)').matches;
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero__title-line', { y: 80, opacity: 0, stagger: 0.15, duration: 1 })
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero__ctas .btn', { y: 40, opacity: 0, stagger: 0.1, duration: 0.7 }, '-=0.4')
    .from('.hero__mascot-wrap',
      heroIsMobile
        ? { y: 60, opacity: 0, scale: 0.92, duration: 1.2 }
        : { x: 100, opacity: 0, scale: 0.8, duration: 1.2 },
      '-=1')
    .from('.hero__scroll-hint', { opacity: 0, y: 20, duration: 0.6 }, '-=0.3');

  /* ---- Hero scroll: zoom + parallax depth layers ---- */
  const heroBg = document.querySelector('.hero__bg-layer');
  const heroMascot = document.querySelector('.hero__mascot-wrap');
  const heroContent = document.querySelector('.hero__left');

  if (heroBg) {
    gsap.to(heroBg, {
      scale: 1.2,
      y: 150,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  if (heroMascot) {
    gsap.to(heroMascot, {
      y: -80,
      x: heroIsMobile ? 0 : 40,
      rotation: heroIsMobile ? 0 : 5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  if (heroContent) {
    gsap.to(heroContent, {
      y: -60,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '60% top',
        scrub: 1,
      },
    });
  }

  /* The hero character keeps only its smooth CSS float animation. The old
     mouse-parallax was removed because it wrote to the same transform as the
     float animation, which caused the hero to jitter/glitch while scrolling. */

  /* ---- Section background parallax ----
     Exclude the hero background: it has its own dedicated scale+shift tween
     above, and running both on the same element made the hero jitter. */
  document.querySelectorAll('[data-parallax]:not(.hero__bg-layer)').forEach((bg) => {
    const speed = parseFloat(bg.dataset.parallax) || 0.15;
    gsap.to(bg, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: bg.closest('.section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  /* ---- Reveal animations ---- */
  const revealConfig = [
    { sel: '.reveal-up', props: { y: 60, opacity: 0 } },
    { sel: '.reveal-left', props: { x: -60, opacity: 0 } },
    { sel: '.reveal-right', props: { x: 60, opacity: 0 } },
    { sel: '.reveal-scale', props: { scale: 0.85, opacity: 0 } },
    { sel: '.reveal-blur', props: { filter: 'blur(12px)', opacity: 0 } },
  ];

  revealConfig.forEach(({ sel, props }) => {
    gsap.utils.toArray(sel).forEach((el) => {
      gsap.to(el, {
        ...Object.fromEntries(Object.entries(props).map(([k, v]) => [k, 0])),
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  });

  /* ---- Token card stagger ---- */
  gsap.from('.token-card', {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.tokenomics__grid',
      start: 'top 80%',
    },
  });

  /* ---- Gallery items stagger ---- */
  gsap.from('.gallery__item', {
    scale: 0.8,
    opacity: 0,
    stagger: { amount: 0.6, from: 'random' },
    duration: 0.5,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.gallery__grid',
      start: 'top 85%',
    },
  });

  /* ---- Character bands: seamless scroll-driven marquee ----
     The track is two identical halves. We move it by an amount tied to scroll
     progress and wrap that amount within one half's width, so the strip is
     always full (no empty edges) and loops seamlessly in both directions.
     Band 0 drifts left on scroll-down; band 1 drifts right on scroll-down. */
  const mod = (n, m) => ((n % m) + m) % m;
  document.querySelectorAll('.char-band').forEach((band, bandIdx) => {
    const track = band.querySelector('.char-band__track');
    if (!track) return;

    const dir = bandIdx % 2 === 0 ? -1 : 1; // -1 = drift left, +1 = drift right on scroll-down
    const FACTOR = 0.5;                      // track px moved per px scrolled — locked to scroll
    let setWidth = track.scrollWidth / 2 || 1;

    /* Position is derived directly from the scroll position, so the strip moves
       exactly in step with the wheel (never faster). The value is wrapped within
       one half-width, so the strip is always full and loops seamlessly. */
    const apply = (scroll) => {
      const travel = scroll * FACTOR;
      const x = dir === -1 ? -mod(travel, setWidth) : mod(travel, setWidth) - setWidth;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const st = ScrollTrigger.create({
      trigger: band,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => apply(self.scroll()),
    });

    /* Recompute the half-width when layout changes (fonts/images/resize) */
    const recalc = () => { setWidth = track.scrollWidth / 2 || 1; apply(st.scroll()); };
    window.addEventListener('load', recalc);
    ScrollTrigger.addEventListener('refresh', recalc);
    apply(st.scroll() || 0);
  });

  /* ---- Community buttons ---- */
  gsap.from('.community__btn', {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.community__buttons',
      start: 'top 85%',
    },
  });

  /* ---- Nav scroll state ---- */
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      const nav = document.getElementById('siteNav');
      if (nav) nav.classList.toggle('is-scrolled', self.scroll() > 80);
    },
  });

  /* ---- Scroll progress bar ---- */
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
      },
    });
  }

  /* ---- Recalculate trigger positions once images/fonts finish loading ----
     Heavy images below the fold shift the layout after init; without this the
     Story and Gallery reveals can keep their wrong start positions and never
     fire, leaving those sections stuck hidden. */
  let refreshTimer;
  const scheduleRefresh = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  };
  scheduleRefresh();
  window.addEventListener('load', scheduleRefresh);
  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', scheduleRefresh, { once: true });
  });
}

/* Terminal typing effect */
function initTerminal() {
  const terminal = document.getElementById('terminalText');
  if (!terminal) return;

  const fullText =
    'Every dog has its day — but the OGs never got theirs. When the golden age faded and the culture moved on, one survivor refused to roll over. Doge Reborn claws its way back from the ashes to reclaim the throne it was always owed. Born on BNB Chain. Zero tax. Locked liquidity.';

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        typeText(terminal, fullText, 25);
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(terminal.closest('.terminal') || terminal);
}

function typeText(el, text, speed) {
  let i = 0;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'terminal__cursor';

  function tick() {
    if (i < text.length) {
      el.textContent = text.slice(0, i + 1);
      i++;
      setTimeout(tick, speed + Math.random() * 15);
    } else {
      el.appendChild(cursor);
    }
  }
  tick();
}

/* Animated token counters */
function initTokenCounters() {
  const cards = document.querySelectorAll('.token-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const valueEl = card.querySelector('.token-card__value');
        const barEl = card.querySelector('.token-card__bar-fill');
        const target = parseInt(valueEl.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(eased * target);
          valueEl.textContent = `${current}%`;
          if (barEl) barEl.style.width = `${current}%`;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        observer.unobserve(card);
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach((card) => observer.observe(card));
}

/* Magnetic button effect */
function initMagneticButtons() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.btn--magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* Button ripple */
function initRipples() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn__ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* Logo easter egg */
function initLogoEasterEgg() {
  const logos = document.querySelectorAll('[data-logo-easter]');
  logos.forEach((logo) => {
    let clicks = 0;
    logo.addEventListener('click', () => {
      clicks++;
      gsap.to(logo, {
        rotation: clicks * 360,
        scale: 1.2,
        duration: 0.6,
        ease: 'back.out(2)',
        onComplete: () => gsap.to(logo, { scale: 1, duration: 0.3 }),
      });
      if (clicks >= 5) {
        gsap.to(logo, {
          filter: 'drop-shadow(0 0 60px #00e5ff) hue-rotate(90deg)',
          duration: 0.5,
          yoyo: true,
          repeat: 3,
        });
        clicks = 0;
      }
    });
  });
}

/* 3D card tilt */
function initCardTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.card-3d, .token-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
    });
  });
}
