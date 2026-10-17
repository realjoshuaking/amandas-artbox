// Amanda's Artbox — hero crossfade slideshow.
// Photos rest full-frame, then gradually dissolve into the next one.
(function () {
  var root = document.querySelector("[data-slideshow]");
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll(".slide"));
  var prevBtn = root.querySelector(".slide-prev");
  var nextBtn = root.querySelector(".slide-next");
  var dotsWrap = root.querySelector(".slide-dots");
  var index = 0;
  var timer = null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HOLD_MS = 3500; // viewing time per photo before the fade begins

  // Build dots
  var dots = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Go to slide " + (i + 1));
    b.addEventListener("click", function () { goTo(i); restart(); });
    dotsWrap.appendChild(b);
    return b;
  });

  function render() {
    slides.forEach(function (s, i) { s.classList.toggle("active", i === index); });
    dots.forEach(function (d, i) {
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function start() {
    if (reduceMotion || timer || slides.length < 2) return;
    timer = setInterval(next, HOLD_MS);
  }

  function restart() { stop(); start(); }

  prevBtn.addEventListener("click", function () { prev(); restart(); });
  nextBtn.addEventListener("click", function () { next(); restart(); });

  // Keyboard: left/right arrows when the slideshow has focus
  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { prev(); restart(); }
    if (e.key === "ArrowRight") { next(); restart(); }
  });

  // Touch swipe
  var startX = null;
  root.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  root.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restart(); }
    startX = null;
  }, { passive: true });

  render();

  // Start the timer only once every slide's photo has loaded, so the first
  // slide holds for exactly the same time as all the others.
  (function begin() {
    var imgs = [];
    slides.forEach(function (s) {
      var im = s.querySelector("img");
      if (im) imgs.push(im);
    });
    var pending = imgs.length;
    var started = false;
    function check() {
      if (pending <= 0 && !started) { started = true; start(); }
    }
    if (!pending) { check(); return; }
    imgs.forEach(function (img) {
      function done() { pending--; check(); }
      if (img.complete && img.naturalWidth > 0) { done(); }
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
    check();
    setTimeout(check, 5000); // never wait forever on a stuck image
  })();
})();
