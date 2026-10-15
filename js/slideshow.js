// Amanda's Artbox — header slideshow
(function () {
  var root = document.querySelector("[data-slideshow]");
  if (!root) return;

  var track = root.querySelector(".slideshow-track");
  var slides = Array.prototype.slice.call(track.children);
  var prevBtn = root.querySelector(".slide-prev");
  var nextBtn = root.querySelector(".slide-next");
  var dotsWrap = root.querySelector(".slide-dots");
  var index = 0;
  var timer = null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var AUTOPLAY_MS = 6000;

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
    track.style.transform = "translateX(-" + index * 100 + "%)";
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
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function restart() { stop(); start(); }

  prevBtn.addEventListener("click", function () { prev(); restart(); });
  nextBtn.addEventListener("click", function () { next(); restart(); });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

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
  start();
})();
