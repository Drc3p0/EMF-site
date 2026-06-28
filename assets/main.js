// EMF Explorer - shared site behavior

// Mobile nav toggle
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
});

// Starfield canvas - small drifting "signal" particles, green/cyan theme
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      hue: Math.random() > 0.85 ? "cyan" : "green",
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.twinkle += 0.02;
      const alpha = 0.35 + Math.sin(s.twinkle) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle =
        s.hue === "cyan"
          ? `rgba(94,241,255,${alpha})`
          : `rgba(57,255,148,${alpha})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > h) {
        s.y = 0;
        s.x = Math.random() * w;
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
  });

  init();
  draw();
})();
