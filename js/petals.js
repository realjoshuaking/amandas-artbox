/* Falling petals: lavender on the homepage, yellow on the gallery page.
   The main canvas sits behind the paper-texture overlay and in front of
   the page background image. On the homepage a second, smaller field of
   purple petals falls over the hero's black zone, under the welcome text,
   and hands off seamlessly to the main field below. Slow, snowfall-like drift. */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function createField(o) {
    var canvas = document.createElement("canvas");
    canvas.className = o.className;
    canvas.setAttribute("aria-hidden", "true");
    o.parent.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;
    function resize() {
      W = Math.max(1, canvas.clientWidth);
      H = Math.max(1, canvas.clientHeight);
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

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
        color: o.colors[(Math.random() * o.colors.length) | 0],
        alpha: 0.35 + Math.random() * 0.3
      };
    }
    for (var i = 0; i < o.count; i++) petals.push(spawn(true));

    function drawPetal(p) {
      var s = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      var a = p.alpha;
      if (o.fadeBottom && p.y > H - 80) a *= Math.max(0, (H - p.y) / 80);
      ctx.globalAlpha = a;
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
  }

  var THEMES = {
    home: ["#c4b5fd", "#b39ddb", "#a78bfa", "#d8ccf5", "#b7a6ef"],
    "gallery-page": ["#e6ca3e", "#f2d765", "#d4af37", "#f7e08a", "#e8cf4d"]
  };
  var theme = null;
  for (var k in THEMES) {
    if (document.body.classList.contains(k)) { theme = THEMES[k]; break; }
  }
  if (theme) {
    createField({
      className: "petals",
      parent: document.body,
      colors: theme,
      count: 46
    });
  }

  /* Purple petals over the hero's black zone only: above the slideshow
     photos, below the welcome text, fading out at the hero's bottom edge
     so they hand off to the main field with no visible border. */
  if (document.body.classList.contains("home")) {
    var hero = document.querySelector(".hero-full");
    if (hero) {
      createField({
        className: "petals hero-petals",
        parent: hero,
        colors: ["#8b5cf6", "#a78bfa", "#7c3aed", "#c4b5fd", "#6d28d9"],
        count: 26,
        fadeBottom: true
      });
    }
  }
})();
