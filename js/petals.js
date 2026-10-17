/* Falling petals: lavender on the homepage, yellow on the gallery page.
   The canvas sits behind the paper-texture overlay and in front of the
   page background image. Slow, snowfall-like drift. */
(function () {
  var THEMES = {
    home: ["#c4b5fd", "#b39ddb", "#a78bfa", "#d8ccf5", "#b7a6ef"],
    "gallery-page": ["#e6ca3e", "#f2d765", "#d4af37", "#f7e08a", "#e8cf4d"]
  };
  var theme = null;
  for (var k in THEMES) {
    if (document.body.classList.contains(k)) { theme = THEMES[k]; break; }
  }
  if (!theme) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.className = "petals";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  var COUNT = 46;
  var petals = [];
  function spawn(anyY) {
    return {
      x: Math.random() * W,
      y: anyY ? Math.random() * H : -20 - Math.random() * 40,
      size: 5 + Math.random() * 8,
      speed: 16 + Math.random() * 30,
      swayAmp: 18 + Math.random() * 26,
      swayFreq: 0.4 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.2,
      color: theme[(Math.random() * theme.length) | 0],
      alpha: 0.35 + Math.random() * 0.3
    };
  }
  for (var i = 0; i < COUNT; i++) petals.push(spawn(true));

  function drawPetal(p) {
    var s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = "rgba(25, 12, 40, 0.35)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.85, -s * 0.55, s * 0.85, s * 0.55, 0, s);
    ctx.bezierCurveTo(-s * 0.85, s * 0.55, -s * 0.85, -s * 0.55, 0, -s);
    ctx.fill();
    ctx.restore();
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    var t = now / 1000;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < petals.length; i++) {
      var p = petals[i];
      p.y += p.speed * dt;
      p.x += Math.sin(t * p.swayFreq + p.phase) * p.swayAmp * dt;
      p.angle += p.spin * dt;
      if (p.y > H + 30 || p.x < -40 || p.x > W + 40) petals[i] = spawn(false);
      drawPetal(petals[i]);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
