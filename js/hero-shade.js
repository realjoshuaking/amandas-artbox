// Amanda's Artbox — hero shade: dark behind the slideshow, fading out as you
// scroll just past the hero so the normal background returns.
(function () {
  var shade = document.querySelector(".hero-shade");
  if (!shade) return;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".hero-full");
  var MAX_OPACITY = 0.82;
  var ticking = false;

  function range() {
    return Math.max(1, hero ? hero.offsetHeight : window.innerHeight);
  }

  function update() {
    ticking = false;
    var p = 1 - Math.min(window.scrollY / range(), 1);
    shade.style.opacity = reduceMotion
      ? (p > 0.5 ? MAX_OPACITY : 0)
      : (MAX_OPACITY * p).toFixed(3);
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
