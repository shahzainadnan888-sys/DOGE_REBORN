/* DOGE REBORN — Canvas Particle System */
class ParticleField {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.opts = {
      count: options.count || 60,
      colors: options.colors || ['#00e5ff', '#ffc843', '#a855f7', '#ff8c2a'],
      maxSize: options.maxSize || 3,
      speed: options.speed || 0.4,
      connectDistance: options.connectDistance || 120,
      ...options,
    };
    this.running = false;
    this._onResize = this.resize.bind(this);
    this._onMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    };
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = parent.clientWidth * dpr;
    this.canvas.height = parent.clientHeight * dpr;
    this.canvas.style.width = `${parent.clientWidth}px`;
    this.canvas.style.height = `${parent.clientHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = parent.clientWidth;
    this.h = parent.clientHeight;
  }

  init() {
    this.resize();
    this.particles = [];
    for (let i = 0; i < this.opts.count; i++) {
      this.particles.push(this._create());
    }
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMove);
  }

  _create() {
    return {
      x: Math.random() * (this.w || 800),
      y: Math.random() * (this.h || 600),
      vx: (Math.random() - 0.5) * this.opts.speed,
      vy: (Math.random() - 0.5) * this.opts.speed - 0.2,
      size: Math.random() * this.opts.maxSize + 0.5,
      color: this.opts.colors[Math.floor(Math.random() * this.opts.colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._loop();
  }

  stop() {
    this.running = false;
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMove);
  }

  _loop() {
    if (!this.running) return;
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    this.particles.forEach((p, i) => {
      /* Mouse repulsion */
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150) {
        const force = (150 - dist) / 150;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = a;
      ctx.fill();
      ctx.globalAlpha = 1;

      /* Connect nearby particles */
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const d = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (d < this.opts.connectDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - d / this.opts.connectDistance) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    requestAnimationFrame(() => this._loop());
  }
}

function initParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return [];

  const fields = [];
  const configs = [
    { id: 'heroParticles', count: 50, connectDistance: 100 },
    { id: 'communityParticles', count: 30, connectDistance: 80 },
  ];

  configs.forEach((cfg) => {
    const canvas = document.getElementById(cfg.id);
    if (!canvas) return;
    const field = new ParticleField(canvas, cfg);
    field.init();
    field.start();
    fields.push(field);
  });

  return fields;
}
