/* ============================================================
   LUYZA T.A — AESTHESIS
   Atmospheric animation system
   Dutch Golden Age · Candlelight · Floating dust · Parallax
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  setActiveNav();
  animatePageIn();
  initReveal();
  if (!reducedMotion) {
    initDust();
    initCandlelight();
    initHeroParallax();
    initImageDepth();
  }
  initContactForm();
});

/* ── Navigation ──────────────────────────────────────────────── */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Active nav link ─────────────────────────────────────────── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Page entry fade ─────────────────────────────────────────── */
function animatePageIn() {
  const page = document.querySelector('.page');
  if (page) page.classList.add('page-enter');
}

/* ── Scroll-triggered reveal ─────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── Floating dust motes ─────────────────────────────────────── */
function initDust() {
  const canvas = document.createElement('canvas');
  canvas.id = 'dust-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Mote {
    constructor(initial) {
      this.reset(initial ?? true);
    }
    reset(initial) {
      this.x       = Math.random() * W;
      this.y       = initial ? Math.random() * H : H + 12;
      this.radius  = Math.random() * 1.3 + 0.25;
      this.vx      = (Math.random() - 0.5) * 0.14;
      this.vy      = -(Math.random() * 0.20 + 0.05);
      this.alpha   = Math.random() * 0.40 + 0.05;
      this.life    = 0;
      this.maxLife = Math.random() * 380 + 180;
      this.phase   = Math.random() * Math.PI * 2;
      /* Warm amber—gold spectrum */
      this.r = 195 + Math.floor(Math.random() * 28);
      this.g = 138 + Math.floor(Math.random() * 28);
      this.b = 18  + Math.floor(Math.random() * 22);
    }
    update() {
      /* Gentle lateral drift using a sine wave */
      this.x += this.vx + Math.sin(this.life * 0.018 + this.phase) * 0.1;
      this.y += this.vy;
      this.life++;
      if (this.y < -12 || this.life > this.maxLife) this.reset(false);
    }
    draw() {
      const t = this.life / this.maxLife;
      /* Fade in over first 10%, fade out over last 15% */
      const fade = t < 0.10 ? t / 0.10 : t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
      ctx.save();
      ctx.globalAlpha = this.alpha * fade;
      ctx.fillStyle   = `rgb(${this.r},${this.g},${this.b})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    const count = Math.min(65, Math.floor((W * H) / 18000));
    particles   = Array.from({ length: count }, () => new Mote(true));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  loop();
}

/* ── Candlelight glow — slow atmospheric drift ───────────────── */
function initCandlelight() {
  const glow = document.createElement('div');
  glow.className = 'candle-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let cx = window.innerWidth  * 0.22;
  let cy = window.innerHeight * 0.62;
  let tx = cx, ty = cy;
  let t  = 0;

  glow.style.left = cx + 'px';
  glow.style.top  = cy + 'px';

  function drift() {
    t  += 0.0025;
    /* Slow sinusoidal anchor point — feels like a flame drifting */
    tx = window.innerWidth  * (0.18 + Math.sin(t * 1.05) * 0.16);
    ty = window.innerHeight * (0.52 + Math.cos(t * 0.68) * 0.22);

    cx += (tx - cx) * 0.007;
    cy += (ty - cy) * 0.007;

    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(drift);
  }
  drift();
}

/* ── Hero parallax on scroll ─────────────────────────────────── */
function initHeroParallax() {
  const hero      = document.querySelector('.hero');
  const heroInner = document.querySelector('.hero-inner');
  if (!hero || !heroInner) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y     = window.scrollY;
        const limit = hero.offsetHeight;
        if (y <= limit) {
          const pct = y / limit;
          heroInner.style.transform = `translateY(${y * 0.20}px)`;
          heroInner.style.opacity   = String(Math.max(0, 1 - pct * 0.65));
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Subtle depth on photo hover ─────────────────────────────── */
function initImageDepth() {
  document.querySelectorAll('.preview-photo, .photo-item').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const img = el.querySelector('img');
      if (img) {
        img.style.transform = `scale(1.045) translate(${x * -6}px, ${y * -6}px)`;
      }
    });
    el.addEventListener('mouseleave', () => {
      const img = el.querySelector('img');
      if (img) img.style.transform = '';
    });
  });
}

/* ── Contact form ────────────────────────────────────────────── */
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = 'enviado —';
    btn.style.color       = 'var(--accent-hot)';
    btn.style.borderColor = 'var(--accent-dim)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.color       = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3500);
  });
}
