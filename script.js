/* ============================================================
   DOGE REBORN — interactions
   Your original comic UI + MAME-style scroll motion
   (scroll-linked character bands, parallax, reveals)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const contractAddress = "0xe92F7Fe3EAf61DF28b7B75f3FaAB199333c42302";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SHOT = /[?&]shot/.test(location.search); // deterministic-render mode for screenshots
  if (SHOT) {
    document.documentElement.style.scrollBehavior = "auto";
    document.querySelectorAll(".section-illustrated").forEach(s => { s.style.minHeight = "0"; });
  }

  // ---- 1. All 39 characters ----
  const ALL_CHARACTERS = [
    { name: "Doge", file: "doge.jpg" }, { name: "Shiba", file: "shiba.jpg" },
    { name: "Pepe", file: "pepe.jpg" }, { name: "Floki", file: "floki.jpg" },
    { name: "Bonk", file: "bonk.jpg" }, { name: "Cheems", file: "cheems.jpg" },
    { name: "Catgirl", file: "catgirl.jpg" }, { name: "Elon", file: "elon.jpg" },
    { name: "Siren", file: "siren.jpg" }, { name: "Wojak", file: "wojak.jpg" },
    { name: "BabyDoge", file: "babydoge.jpg" }, { name: "Kabosu", file: "kabosu.jpg" },
    { name: "Mother", file: "mother.jpg" }, { name: "Ponke", file: "ponke.jpg" },
    { name: "Wif", file: "wif.jpg" }, { name: "Turbo", file: "turbo.jpg" },
    { name: "Troll", file: "troll.jpg" }, { name: "Pnut", file: "pnut.jpg" },
    { name: "Hawk", file: "hawk.jpg" }, { name: "Quant", file: "quant.jpg" },
    { name: "Akita", file: "akita.jpg" }, { name: "Arc", file: "arc.jpg" },
    { name: "Ban", file: "ban.jpg" }, { name: "Bob", file: "bob.jpg" },
    { name: "Davido", file: "davido.jpg" }, { name: "Dobo", file: "dobo.jpg" },
    { name: "Fartcoin", file: "fartcoin.jpg" }, { name: "Hoge", file: "hoge.jpg" },
    { name: "JellyJelly", file: "jellyjelly.jpg" }, { name: "Jenner", file: "jenner.jpg" },
    { name: "Json", file: "json.jpg" }, { name: "Kishu", file: "kishu.jpg" },
    { name: "Ladys", file: "ladys.jpg" }, { name: "Leash", file: "leash.jpg" },
    { name: "LiveMom", file: "livemom.jpg" }, { name: "Pit", file: "pit.jpg" },
    { name: "Samo", file: "samo.jpg" }, { name: "Useless", file: "useless.jpg" },
    { name: "Would", file: "would.jpg" },
  ];

  // ---- 2. Render gallery grid (39 characters) ----
  const galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid) {
    ALL_CHARACTERS.forEach(char => {
      const card = document.createElement("div");
      card.className = "relative aspect-square border-4 border-black rounded-2xl overflow-hidden shadow-[5px_5px_0_#000] hover:scale-105 hover:-translate-y-1.5 transition-all duration-200 cursor-pointer group";
      card.innerHTML = `
        <img src="characters/${char.file}" alt="${char.name}" class="w-full h-full object-cover" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span class="text-[10px] text-white/70 uppercase tracking-wider" style="font-family: var(--font-outfit), sans-serif;">$DOGER</span>
          <span class="text-base uppercase tracking-wider leading-none mt-1" style="font-family: var(--font-bangers), cursive; color: var(--gold-bright);">
            ${char.name}
          </span>
        </div>`;
      galleryGrid.appendChild(card);
    });
  }

  // ---- 3. Fill the scroll-linked character bands (your characters) ----
  function fillBand(band, list) {
    if (!band) return;
    list.concat(list).forEach(char => {
      const p = document.createElement("div");
      p.className = "band__panel";
      p.innerHTML = `<img src="characters/${char.file}" alt="" loading="lazy" />`;
      band.appendChild(p);
    });
  }
  const third = Math.ceil(ALL_CHARACTERS.length / 3);
  fillBand(document.getElementById("bandA"), ALL_CHARACTERS.slice(0, third));
  fillBand(document.getElementById("bandB"), ALL_CHARACTERS.slice(third, third * 2));
  fillBand(document.getElementById("bandC"), ALL_CHARACTERS.slice(third * 2));

  // ---- 4. Deterministic fireflies in hero sky ----
  const firefliesContainer = document.getElementById("firefliesContainer");
  if (firefliesContainer && !reduceMotion) {
    const FIREFLIES = [
      { left: 12, top: 25, dur: 6.5, delay: 0.2, size: 4 }, { left: 24, top: 45, dur: 9.0, delay: 1.5, size: 3 },
      { left: 38, top: 32, dur: 5.5, delay: 0.8, size: 5 }, { left: 52, top: 62, dur: 10.2, delay: 2.3, size: 4 },
      { left: 68, top: 28, dur: 7.8, delay: 1.1, size: 3 }, { left: 78, top: 55, dur: 8.5, delay: 0.4, size: 5 },
      { left: 88, top: 38, dur: 6.0, delay: 2.8, size: 3 }, { left: 15, top: 72, dur: 9.5, delay: 3.2, size: 4 },
      { left: 32, top: 82, dur: 7.2, delay: 1.9, size: 5 }, { left: 48, top: 18, dur: 11.0, delay: 0.5, size: 3 },
      { left: 62, top: 78, dur: 8.0, delay: 2.1, size: 4 }, { left: 82, top: 22, dur: 6.8, delay: 1.3, size: 5 },
      { left: 92, top: 68, dur: 9.8, delay: 3.5, size: 3 }, { left: 42, top: 50, dur: 5.8, delay: 0.1, size: 4 },
      { left: 72, top: 85, dur: 8.2, delay: 1.7, size: 3 },
    ];
    FIREFLIES.forEach(ff => {
      const fly = document.createElement("div");
      fly.className = "firefly";
      fly.style.left = `${ff.left}%`; fly.style.top = `${ff.top}%`;
      fly.style.width = `${ff.size}px`; fly.style.height = `${ff.size}px`;
      fly.style.animationDuration = `${ff.dur}s`; fly.style.animationDelay = `${ff.delay}s`;
      firefliesContainer.appendChild(fly);
    });
  }

  // ---- 5. Copy contract address ----
  const copyCAButton = document.getElementById("copyCAButton");
  if (copyCAButton) {
    copyCAButton.addEventListener("click", () => {
      navigator.clipboard.writeText(contractAddress).then(() => {
        const originalText = copyCAButton.innerText;
        copyCAButton.innerText = "COPIED!";
        setTimeout(() => { copyCAButton.innerText = originalText; }, 2000);
      }).catch(() => {});
    });
  }

  // ---- 6. Smooth scroll engine: eased rAF loop drives ALL scroll motion ----
  // Everything reads from a lerped `smoothY` (not raw scrollY) so parallax,
  // hero zoom and the character bands glide and settle like the MAME site
  // instead of snapping frame-to-frame. Native scroll is left untouched.
  const scrollIndicator = document.getElementById("scrollIndicator");
  const siteNav = document.getElementById("siteNav");
  const heroBg = document.getElementById("heroBg");
  const heroEl = document.getElementById("hero");
  const EASE = 0.1;                 // higher = snappier, lower = more glide
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Absolute document offset of an element (independent of current scroll)
  function docTop(el) {
    let top = 0, n = el;
    while (n) { top += n.offsetTop; n = n.offsetParent; }
    return top;
  }

  // Cached layout so the loop never touches getBoundingClientRect (jank-free)
  let bgLayers = [], bands = [], heroLayers = [], heroH = window.innerHeight;
  function cacheLayout() {
    bgLayers = Array.prototype.slice.call(document.querySelectorAll(".parallax-bg")).map(bg => {
      const sect = bg.closest(".section-illustrated");
      return { bg, top: docTop(sect), h: sect.offsetHeight,
               factor: parseFloat(bg.getAttribute("data-parallax")) || 0.15,
               isHero: bg === heroBg };
    });
    bands = Array.prototype.slice.call(document.querySelectorAll(".band-wrap")).map(w => ({
      wrap: w, rows: Array.prototype.slice.call(w.querySelectorAll(".band")),
      top: docTop(w), h: w.offsetHeight
    }));
    heroLayers = Array.prototype.slice.call(document.querySelectorAll(".hero-float, .hero-parallax"))
      .map(el => ({ el, depth: parseFloat(el.getAttribute("data-depth")) || 40 }));
    heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;
  }

  function scrubBand(b, smoothY, vh) {
    const rectTop = b.top - smoothY;
    let p = clamp((vh - rectTop) / (vh + b.h), 0, 1);
    if (!b.wrap.classList.contains("scrubbing")) b.wrap.classList.add("scrubbing");
    const range = Math.max(window.innerWidth, 900) * 0.5;
    const shift = (p - 0.5) * range;
    b.rows.forEach((row, i) => {
      const base = row.classList.contains("band--b") ? -40 : (row.classList.contains("band--c") ? -32 : -25);
      const rot = row.classList.contains("band--c") ? 2 : -2.5;
      const dir = (i % 2 === 0) ? -1 : 1;
      row.style.transform = `translateX(${base}%) translateX(${dir * shift}px) rotate(${rot}deg)`;
    });
  }

  let targetY = window.scrollY;
  let smoothY = window.scrollY;
  let running = false;

  function render() {
    smoothY += (targetY - smoothY) * EASE;
    if (Math.abs(targetY - smoothY) < 0.25) smoothY = targetY;
    const vh = window.innerHeight;

    // progress bar (snappy — use real scroll)
    const docH = document.documentElement.scrollHeight - vh;
    if (scrollIndicator) scrollIndicator.style.width = `${docH > 0 ? (targetY / docH) * 100 : 0}%`;
    // nav solid past the hero
    if (siteNav) siteNav.classList.toggle("scrolled", targetY > vh * 0.6);

    if (!reduceMotion) {
      const heroProg = clamp(smoothY / heroH, 0, 1);
      // background layers
      bgLayers.forEach(s => {
        if (s.isHero) {
          // Hero: subtle zoom-in + downward drift → foreground pulls away = depth
          s.bg.style.transform = `translateY(${heroProg * 72}px) scale(${1 + heroProg * 0.14})`;
        } else {
          const prog = (s.top - smoothY + s.h / 2 - vh / 2) / vh; // -1..1
          s.bg.style.transform = `translateY(${prog * s.factor * 100}px)`;
        }
      });
      // hero layers drift up at their own depth (near elements move most)
      heroLayers.forEach(l => {
        l.el.style.transform = `translate3d(0, ${-heroProg * l.depth}px, 0)`;
      });
      // scroll-linked character bands
      bands.forEach(b => scrubBand(b, smoothY, vh));
    }

    if (smoothY !== targetY) { requestAnimationFrame(render); }
    else { running = false; }
  }
  function requestRender() { if (!running) { running = true; requestAnimationFrame(render); } }

  cacheLayout();
  window.addEventListener("scroll", () => { targetY = window.scrollY; requestRender(); }, { passive: true });
  window.addEventListener("resize", () => { cacheLayout(); requestRender(); });
  window.addEventListener("load", () => { cacheLayout(); requestRender(); });
  render(); // initial paint

  // ---- 7. Mouse parallax / tilt on hero mascot ----
  const heroMascotCard = document.getElementById("heroMascotCard");
  if (heroMascotCard && !reduceMotion) {
    window.addEventListener("mousemove", (e) => {
      const rect = heroMascotCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const dist = Math.hypot(x, y);
      if (dist < 600) {
        const tiltX = (y / (rect.height / 2)) * -12;
        const tiltY = (x / (rect.width / 2)) * 12;
        heroMascotCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
      } else {
        heroMascotCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
    });
    heroMascotCard.addEventListener("mouseleave", () => {
      heroMascotCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // ---- 8. Scroll reveal ----
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (SHOT || !("IntersectionObserver" in window)) {
    revealElements.forEach(el => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---- 9. Percentage count-up ----
  const percentageGrid = document.getElementById("percentageGrid");
  if (SHOT && percentageGrid) {
    percentageGrid.querySelectorAll(".percent-num").forEach(num => {
      num.innerText = `${num.getAttribute("data-target")}%`;
    });
  } else if (percentageGrid && "IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".percent-num").forEach(num => {
            const target = parseInt(num.getAttribute("data-target"), 10);
            const duration = 1500; const start = performance.now();
            const animate = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);
              num.innerText = `${Math.round(eased * target)}%`;
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    countObserver.observe(percentageGrid);
  } else if (percentageGrid) {
    percentageGrid.querySelectorAll(".percent-num").forEach(num => {
      num.innerText = `${num.getAttribute("data-target")}%`;
    });
  }
});
