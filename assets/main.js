// EMF Explorer - shared site behavior

// ── Mobile nav toggle ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
  }

  // Mark active nav link based on current page
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  // Scroll reveal
  initReveal();
});

// ── Scroll reveal ──────────────────────────────────────────────────────────
function initReveal() {
  const targets = document.querySelectorAll(
    "section:not(.hero) .panel, section:not(.hero) .card, .section-head, .grid > img"
  );

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  targets.forEach((el) => {
    // Already in viewport on load? Show immediately, no animation
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      el.classList.add("reveal", "visible");
    } else {
      // Stagger siblings inside a grid
      const parent = el.parentElement;
      if (parent && parent.classList.contains("grid")) {
        const idx = Array.from(parent.children).indexOf(el);
        el.style.transitionDelay = idx * 55 + "ms";
      }
      el.classList.add("reveal");
      obs.observe(el);
    }
  });
}

// ── Starfield ──────────────────────────────────────────────────────────────
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars;
  let streaks = [];
  let bursts = [];
  let streakTimer = 0;
  let burstTimer = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    const count = Math.floor((w * h) / 8000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.3,
      vy: Math.random() * 0.18 + 0.02,
      vx: (Math.random() - 0.5) * 0.05,
      hue:
        Math.random() < 0.06
          ? "magenta"
          : Math.random() < 0.2
          ? "cyan"
          : "green",
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.018 + 0.008,
    }));
    streaks = [];
    bursts = [];
  }

  function col(hue, a) {
    if (hue === "cyan")    return `rgba(94,241,255,${a})`;
    if (hue === "magenta") return `rgba(255,94,196,${a})`;
    return `rgba(57,255,148,${a})`;
  }

  function spawnStreak() {
    const fromLeft = Math.random() > 0.5;
    streaks.push({
      x: fromLeft ? -120 : w + 120,
      y: Math.random() * h * 0.85 + h * 0.05,
      speed: (Math.random() * 3.5 + 2.5) * (fromLeft ? 1 : -1),
      length: Math.random() * 90 + 40,
      alpha: 0,
      hue:
        Math.random() < 0.15
          ? "magenta"
          : Math.random() < 0.4
          ? "cyan"
          : "green",
    });
  }

  function spawnBurst() {
    bursts.push({
      x: Math.random() * w * 0.9 + w * 0.05,
      y: Math.random() * h * 0.9 + h * 0.05,
      r: 1,
      maxR: Math.random() * 70 + 25,
      hue:
        Math.random() < 0.12
          ? "magenta"
          : Math.random() < 0.45
          ? "cyan"
          : "green",
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Stars
    for (const s of stars) {
      s.twinkle += s.twinkleSpeed;
      const alpha = 0.28 + Math.sin(s.twinkle) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = col(s.hue, Math.max(0, alpha));
      ctx.fill();
      s.y += s.vy;
      s.x += s.vx;
      if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      if (s.x < -5) s.x = w + 5;
      if (s.x > w + 5) s.x = -5;
    }

    // Signal streaks
    streakTimer++;
    if (streakTimer > 200 + Math.random() * 300) {
      spawnStreak();
      streakTimer = 0;
    }
    for (let i = streaks.length - 1; i >= 0; i--) {
      const s = streaks[i];
      s.x += s.speed;
      const offscreen = s.x < -200 || s.x > w + 200;
      if (!offscreen && s.alpha < 0.65) s.alpha += 0.05;
      if (offscreen) s.alpha -= 0.08;
      if (s.alpha <= 0) { streaks.splice(i, 1); continue; }

      const dir = s.speed > 0 ? -1 : 1;
      const grd = ctx.createLinearGradient(s.x, s.y, s.x + dir * s.length, s.y);
      grd.addColorStop(0, col(s.hue, s.alpha));
      grd.addColorStop(1, col(s.hue, 0));
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + dir * s.length, s.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // EMF burst rings
    burstTimer++;
    if (burstTimer > 280 + Math.random() * 420) {
      spawnBurst();
      burstTimer = 0;
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.r += 0.7;
      const alpha = 0.35 * (1 - b.r / b.maxR);
      if (b.r >= b.maxR) { bursts.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = col(b.hue, alpha);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();
